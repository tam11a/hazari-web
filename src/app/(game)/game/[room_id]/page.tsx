"use client";

import cards from "./cards";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

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

export default function Game() {
  const [hands, setHands] = useState<{
    [key: number]: string[];
  }>([]);

  const [items, setItems] = useState<string[]>([]);

  function shuffle() {
    const keys = Object.keys(cards);
    const shuffled = keys.sort(() => Math.random() - 0.5);
    return shuffled;
  }

  function deal() {
    const deck = shuffle();

    // distribute 13 cards to each player
    // eslint-disable-next-line prefer-const
    let temp_hands: { [key: number]: string[] } = {
      0: [],
      1: [],
      2: [],
      3: [],
    };
    deck?.map((card, index) => {
      const player = index % 4;
      if (!temp_hands[player]) {
        temp_hands[player] = [];
      }
      temp_hands[player].push(card);
    });
    setHands(temp_hands);
  }

  const sensors = useSensors(useSensor(PointerSensor, {}));

  useEffect(() => {
    setItems(hands[0]);
  }, [hands]);

  return (
    <>
      <Button
        variant="contained"
        color="info"
        className="!m-5"
        onClick={() => {
          deal();
        }}
      >
        Shuffle
      </Button>

      {!!items?.length && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100vw",
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
        <Image src={`/cards/${id}.svg`} alt={id} width={100} height={150} />
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
