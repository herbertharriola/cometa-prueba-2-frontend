import { useState } from "react";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";

interface PaymentFormProps {
  orderId: number;
  onPay: (amount: number, friend: string) => void;
}

export default function PaymentForm({ orderId, onPay }: PaymentFormProps) {
  const [amount, setAmount] = useState(0);
  const [friend, setFriend] = useState("");

  const friends = ["Amigo 1", "Amigo 2", "Amigo 3"];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">Pagar Orden #{orderId}</Typography>
      <TextField select label="Selecciona tu nombre" value={friend} onChange={(e) => setFriend(e.target.value)}>
        {friends.map((f) => (
          <MenuItem key={f} value={f}>
            {f}
          </MenuItem>
        ))}
      </TextField>
      <TextField type="number" label="Monto a pagar" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <Button variant="contained" color="primary" onClick={() => onPay(amount, friend)}>
        Pagar
      </Button>
    </Box>
  );
}
