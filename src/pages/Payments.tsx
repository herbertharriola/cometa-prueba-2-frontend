import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Paper,
  Button,
  Grid,
  Box,
} from "@mui/material";
import axios from "../services/api";
import { Order } from "../types";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [friends] = useState(["Amigo 1", "Amigo 2", "Amigo 3"]);
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("individual");
  const [totalForFriend, setTotalForFriend] = useState<number>(0);
  const [friendsThatPayed, setFriendsThatPayed] = useState<number>(0);

  useEffect(() => {
    axios.get("/orders").then((res) => setOrders(res.data));
  }, []);

  useEffect(() => {
    if (selectedOrder && selectedFriend) {
      axios
        .get(`/payment/${selectedOrder}?method=${paymentMethod}`)
        .then((res) => {
          if (paymentMethod === "split") {
            setTotalForFriend(res.data.each_pays[friendsThatPayed]);
          } else if (paymentMethod === "individual") {
            setTotalForFriend(res.data.individual_totals[selectedFriend] || 0);
          }
        })
        .catch((error: any) => alert(error.response.data.detail));
    }
  }, [selectedOrder, selectedFriend, paymentMethod]);

  const handlePayment = async () => {
    if (!selectedOrder || !selectedFriend) {
      alert("Selecciona una orden y a un amigo.");
      return;
    }

    try {
      await axios.post(`/pay`, {
        friend: selectedFriend,
        amount: totalForFriend.toFixed(2),
        order_id: selectedOrder,
      });
      alert("Pago realizado exitosamente!");
      setFriendsThatPayed(friendsThatPayed + 1);
    } catch (error: any) {
      alert(error.response.data.detail);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="flex-end" sx={{ marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/")}
          >
            ⬅ Regresar
          </Button>
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          💳 Realizar Pago
        </Typography>

        {/* Selección de orden */}
        <Select
          fullWidth
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(Number(e.target.value))}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value={0}>Selecciona una orden</MenuItem>
          {orders &&
            orders
              .filter((x) => !x.paid)
              .map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  Orden #{order.id} - Total: ${order.total.toFixed(2)}
                </MenuItem>
              ))}
        </Select>

        {/* Opción para dividir en partes iguales */}
        <Select
          fullWidth
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="individual">Pago individual</MenuItem>
          <MenuItem value="split">Partes iguales</MenuItem>
        </Select>

        {/* Selección de amigo */}
        <Select
          fullWidth
          value={selectedFriend}
          onChange={(e) => setSelectedFriend(e.target.value)}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Selecciona quién paga</MenuItem>
          {friends.map((friend, index) => (
            <MenuItem key={index} value={friend}>
              {friend}
            </MenuItem>
          ))}
        </Select>

        {/* Monto consumido */}
        <Typography variant="h6" align="center" gutterBottom>
          {selectedFriend && selectedOrder
            ? `Total consumido: $${totalForFriend.toFixed(2)}`
            : "Selecciona un amigo y una orden"}
        </Typography>

        {/* Botón de pago */}
        <Grid container justifyContent="center">
          <Button variant="contained" color="primary" onClick={handlePayment}>
            Pagar
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}
