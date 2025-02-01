import { Button, Card, TextField, Typography } from "@mui/material";

export default function Join() {
  return (
    <Card className="!bg-green-100 max-w-md rounded-md p-4 mx-auto flex flex-col items-center space-y-4">
      <Typography variant="button">JOIN A TABLE</Typography>
      <TextField label="Username" size="small" variant="outlined" fullWidth />
      <TextField label="Table ID" size="small" variant="outlined" fullWidth />
      <Button fullWidth variant="contained" color="primary">
        Join Table
      </Button>
    </Card>
  );
}
