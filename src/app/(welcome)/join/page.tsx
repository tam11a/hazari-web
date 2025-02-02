"use client";
import instance from "@/app/axios-instance";
import { Button, Card, Snackbar, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Join() {
  const [table, setTable] = useState<number | null>();
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const joinTable = async () => {
    try {
      const res = await instance.post("/join-table", {
        table_id: table,
        username,
      });
      if (res.status === 201) {
        localStorage.setItem("username", res.data.data.user.name);
        localStorage.setItem("user_id", res.data.data.user.id);
        router.push(`/game/${res.data.data.table.id}`);
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 404) {
        setError("Table not found");
      } else if (err.response?.status === 400) {
        setError("Table is full");
      }
    }
  };

  return (
    <Card className="!bg-green-100 max-w-md rounded-md p-4 mx-auto flex flex-col items-center space-y-4">
      <Typography variant="button">JOIN A TABLE</Typography>
      <TextField
        label="Username"
        size="small"
        variant="outlined"
        required
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        fullWidth
      />
      <TextField
        label="Table ID"
        size="small"
        variant="outlined"
        value={table || ""}
        required
        onChange={(e) => {
          if (e.target.value) setTable(parseInt(e.target.value));
          else setTable(null);
        }}
        type="number"
        fullWidth
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => {
          if (table && username) {
            joinTable();
          }
        }}
      >
        Join Table
      </Button>
      <Typography variant="button">OR</Typography>
      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        onClick={() => {
          router.push("/create");
        }}
      >
        Create New Table
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setError(null)}
        message={error}
      />
    </Card>
  );
}
