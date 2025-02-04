"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button, Chip } from "@mui/material";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GameProps {
  round: number;
  players: {
    id: number;
    name: string;
    admin?: boolean;
    me?: boolean;
    points?: number;
    made_cards: string[];
    cards: string[];
    thrown?: string[];
    next_to_play?: boolean;
    scores: {
      value: number;
    }[];
  }[];
  ready: boolean;
  admin?: boolean;
  hand: string[];
  user_id: number;
  playing_round?: {
    RoundCards: {
      player: { id: number; name: string };
      made_cards: string[];
      cards: string[];
      thrown: string[];
    }[];
    round: number;
    status: string;
  } | null;
  startGame: () => void;
  commitCards: (cards: string[]) => void;
  throwCards: (cards: string[]) => void;
}

export default function Game({
  round,
  players,
  admin,
  startGame,
  hand,
  commitCards,
  throwCards,
  user_id,
  ready = false,
  playing_round,
}: Readonly<GameProps>) {
  const next_to_play = useMemo(
    () => players.find((p) => p.next_to_play),
    [players]
  );

  console.log("players", players);

  const [items, setItems] = useState<string[]>([]);

  const throwFirstThreeFromItems = () => {
    // throw the last cards if there are only 4 cards in items
    if (items.length === 4) {
      throwCards(items.slice(0, 4));
      setItems(items.slice(4));
    } else {
      // send first 3 cards to throw from items and remove them from items.
      throwCards(items.slice(0, 3));
      setItems(items.slice(3));
    }
  };

  useEffect(() => {
    if (hand.length && !items.length) setItems(hand);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hand]);

  const sorted_table = useMemo(() => {
    let tbl = [...players];
    for (let i = 0; i < players.length; i++) {
      if (players[i].me) {
        tbl = [players[i], ...players.slice(i + 1), ...players.slice(0, i)];
        break;
      }
    }
    return tbl;
  }, [players]);

  console.log(players, next_to_play?.id === user_id, next_to_play?.id, user_id);

  const sensors = useSensors(useSensor(PointerSensor, {}));

  return (
    <>
      {round === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-10 bg-slate-800/30 text-white rounded-lg">
          {players?.length < 4 ? (
            <p>Waiting for more players to join the table.</p>
          ) : admin ? (
            <>
              <p>Click the button below to start the game.</p>
              <Button
                variant="contained"
                color="primary"
                className="!m-5 !mb-0 !rounded-full"
                onClick={() => {
                  startGame();
                }}
              >
                Start Game
              </Button>
            </>
          ) : (
            <p>Waiting for Table Admin to start the game.</p>
          )}
        </div>
      )}

      {round !== 0 && playing_round === null ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-10 bg-slate-800/30 text-white rounded-lg">
          {admin ? (
            <>
              <p>Start Round # {round + 1}</p>
              <Button
                variant="contained"
                color="primary"
                className="!m-5 !mb-0 !rounded-full"
                onClick={() => {
                  startGame();
                }}
              >
                Distribute Cards
              </Button>
            </>
          ) : (
            <p>Waiting for admin to distribute cards.</p>
          )}
        </div>
      ) : null}

      {
        // render players on round table in order from bottom-middle, right-middle, top-middle, left-middle
        sorted_table.map((player, index) => (
          <div
            key={player.id}
            className="absolute flex-col items-center justify-center"
            style={
              index === 0
                ? { bottom: "50px", left: "50%" }
                : index === 1
                ? { right: "100px", top: "30%" }
                : index === 2
                ? { top: "100px", left: "50%" }
                : { left: "100px", top: "30%" }
            }
          >
            <div className="flex items-center gap-2">
              <div className="bg-white overflow-hidden rounded-md">
                <Image
                  src={
                    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
                  }
                  alt={player.name}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="text-white flex flex-row items-center">
                  {player.name}
                  <p>{player.me && " (You)"}</p>
                  {!next_to_play && !!player.made_cards?.length ? (
                    <Chip
                      label="Locked"
                      size="small"
                      variant="outlined"
                      color="error"
                      className="ml-3 !bg-red-950 text-xs"
                    />
                  ) : player.next_to_play ? (
                    <Chip
                      label="Playing"
                      size="small"
                      variant="outlined"
                      color="primary"
                      className="ml-3 !bg-lime-300 text-xs"
                    />
                  ) : null}
                </div>
                <p className="text-white text-xs pt-1">
                  {player.admin ? "Admin" : "Player"}{" "}
                  {` (${player.scores?.reduce(
                    (prev: number, data) => data.value + prev,
                    0
                  )} pts)`}
                </p>
              </div>
            </div>

            {/* Render player cards */}
            {!player.me && hand?.length ? (
              <div className="flex gap-0 absolute bottom-0 translate-y-full pt-2">
                {Array(13)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white overflow-hidden rounded-md w-7 shadow shadow-black -ml-4"
                    >
                      <Image
                        src={`/cards/redBack.svg`}
                        alt={`card-back`}
                        width={40}
                        height={60}
                        priority
                      />
                    </div>
                  ))}
              </div>
            ) : null}

            {/* Render thrown cards */}
            {player.thrown?.length ? (
              <div
                className="flex gap-0 absolute justify-center items-center top-0 translate-y-full translate-x-1/3 pt-2 w-full"
                style={{
                  transform: player.me ? `translateY(calc(-100% - 250px))` : ``,
                }}
              >
                {player.thrown.map((card, i) => (
                  <div
                    key={i}
                    className="bg-white overflow-hidden rounded-md w-20 shadow shadow-black -ml-16"
                    style={{
                      transform: `rotate(${i * 10}deg)`,
                    }}
                  >
                    <Image
                      src={`/cards/${card}.svg`}
                      alt={card}
                      width={100}
                      height={150}
                      priority
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))
      }

      {!!items?.length && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
            disabled={ready}
          >
            <div
              style={{
                position: "absolute",
                bottom: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <div className="space-x-2">
                {!ready && (
                  <Button
                    variant="outlined"
                    color="warning"
                    className="!rounded-full !bg-orange-950"
                    onClick={() => {
                      commitCards(items);
                    }}
                  >
                    Lock Cards
                  </Button>
                )}
                {
                  // if it's your turn and you have more than 3 cards, show throw button
                  !!next_to_play &&
                  next_to_play?.id === user_id &&
                  items.length >= 3 &&
                  hand?.length === items.length ? (
                    <Button
                      variant="outlined"
                      color="error"
                      className="!rounded-full !bg-red-950"
                      onClick={throwFirstThreeFromItems}
                    >
                      Throw
                    </Button>
                  ) : null
                }
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  padding: "20px",
                }}
              >
                {items.map((id) => (
                  <SortableItem key={id} id={id} />
                ))}
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </>
  );

  function SortableItem({ id }: { id: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "grab",
      // marginLeft: "-50px",
    };

    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        <Image
          src={`/cards/${id}.svg`}
          alt={id}
          width={100}
          height={150}
          priority
          className="shadow shadow-black"
        />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }
}
