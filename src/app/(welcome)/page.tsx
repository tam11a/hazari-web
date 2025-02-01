import { Button, Card, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Card className="!bg-green-100 max-w-sm w-full aspect-square rounded-md p-4 mx-auto flex flex-col items-center justify-center space-y-4">
      <Typography variant="h4" className="pb-10">
        HAZARI
      </Typography>
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        component={Link}
        href="/create"
      >
        Create New Table
      </Button>
      <Typography variant="button">OR</Typography>
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="info"
        component={Link}
        href="/join"
      >
        Join A Table
      </Button>
    </Card>
  );
}
