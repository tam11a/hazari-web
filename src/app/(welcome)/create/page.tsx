"use client";

import { Button, Card, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const [name, setName] = useState<string>("");
  const [target, setTarget] = useState<number>(1000);
  const router = useRouter();
  return (
    <Card className="!bg-green-100 max-w-md rounded-md p-4 mx-auto flex flex-col items-center space-y-4">
      <Typography variant="button">CREATE NEW TABLE</Typography>
      <TextField
        label="Username"
        size="small"
        variant="outlined"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        fullWidth
        required
      />
      <TextField
        label="Target"
        size="small"
        variant="outlined"
        value={target}
        type="number"
        onChange={(e) => {
          setTarget(parseInt(e.target.value));
        }}
        fullWidth
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => {
          if (name) {
            localStorage.setItem("username", name);
            router.replace("/game/1");
          }
        }}
      >
        Create Table
      </Button>
    </Card>
  );
}
