"use client";

import { Button, IconButton, Snackbar } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { RiStackshareLine } from "react-icons/ri";
import Link from "next/link";

interface GameHeaderProps {
  name: string;
  players: { id: number; name: string }[];
}

export default function GameHeader({
  name,
  players,
}: Readonly<GameHeaderProps>) {
  const { room_id } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="flex flex-row gap-2 items-center">
        <h1 className="text-sm bg-lime-300 w-fit py-2 px-4 rounded-md font-semibold text-lime-900 flex flex-row gap-2 items-center">
          {name}
          <IconButton
            color="default"
            onClick={() => {
              navigator.clipboard.writeText(
                `Join the table #${room_id} by visiting the link: ${window.location.origin}.`
              );
              setOpen(true);
            }}
          >
            <RiStackshareLine />
          </IconButton>
        </h1>

        <div className="flex-grow" />

        <div className="flex flex-row gap-4 bg-lime-300 w-fit py-2 px-4 rounded-md font-semibold items-center text-lime-900">
          <h2>
            <span className="text-lime-900">Players:</span>{" "}
            {players?.length || 0}/4
          </h2>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => {
              localStorage.removeItem("username");
              localStorage.removeItem("user_id");
              router.replace("/");
            }}
          >
            Leave
          </Button>
        </div>
      </header>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setOpen(false)}
        message="Link Copied! You can share it with your friends."
      />
    </>
  );
}
