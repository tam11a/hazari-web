"use client";

import { Button, IconButton, Snackbar } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RiStackshareLine } from "react-icons/ri";
import Link from "next/link";

export default function GameHeader() {
  const { room_id } = useParams();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="flex flex-row gap-2 items-center">
        <h1 className="text-xl bg-lime-300 w-fit py-2 px-4 rounded-md font-semibold text-lime-900 flex flex-row gap-2 items-center">
          Table # {room_id}
          <IconButton
            color="default"
            onClick={() => {
              navigator.clipboard.writeText(window.location.toString());
              setOpen(true);
            }}
          >
            <RiStackshareLine />
          </IconButton>
        </h1>

        <div className="flex-grow" />

        <div className="flex flex-row gap-4 bg-lime-300 w-fit py-2 px-4 rounded-md font-semibold items-center text-lime-900">
          <h2>
            <span className="text-lime-900">Players:</span> 4/4
          </h2>
          <Button
            variant="outlined"
            size="small"
            color="error"
            component={Link}
            href="/"
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
