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
  }[];
  ready: boolean;
  admin?: boolean;
  hand: string[];
  startGame: () => void;
  commitCards: (cards: string[]) => void;
}

export default function Game({
  round,
  players,
  admin,
  startGame,
  hand,
  commitCards,
  ready = false,
}: Readonly<GameProps>) {
  console.log("players", players);

  const [items, setItems] = useState<string[]>([]);

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
                  {!!player.made_cards?.length && (
                    <Chip
                      label="Ready"
                      size="small"
                      color="error"
                      className="ml-3 text-xs"
                    />
                  )}
                </div>
                <p className="text-white text-xs pt-1">
                  {player.admin ? "Admin" : "Player"}{" "}
                  {player.points ? ` (${player.points} pts)` : ` (0 pts)`}
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
              <div>
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
