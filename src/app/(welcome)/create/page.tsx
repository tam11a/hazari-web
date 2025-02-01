"use client";

import instance from "@/app/axios-instance";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [target, setTarget] = useState<number>(1000);
  const router = useRouter();

  const createTable = async () => {
    const res = await instance.post("/create-table", {
      name,
      username,
      target,
    });
    if (res.status === 201) {
      console.log(res.data);
      localStorage.setItem("username", res.data.data.party_owner.name);
      localStorage.setItem("user_id", res.data.data.party_owner.id);
      router.push(`/game/${res.data.data.id}`);
    }
  };

  return (
    <Card className="!bg-green-100 max-w-md rounded-md p-4 mx-auto flex flex-col items-center space-y-4">
      <Typography variant="button">CREATE NEW TABLE</Typography>
      <TextField
        label="Table Name"
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
        label="Username"
        size="small"
        variant="outlined"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
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
          if (name && username) {
            createTable();
          }
        }}
      >
        Create Table
      </Button>
    </Card>
  );
}
