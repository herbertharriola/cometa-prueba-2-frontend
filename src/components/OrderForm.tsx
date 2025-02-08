import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { Beer, Order } from "../types";
import axios from "../services/api";

interface OrderFormProps {
  beers: Beer[];
  setBeers: (beers: Beer[]) => void;
}

const friends = ["Amigo 1", "Amigo 2", "Amigo 3"];

export default function OrderForm({ beers, setBeers }: OrderFormProps) {
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);

  // Obtener datos de cervezas y órdenes
  useEffect(() => {
    axios.get("/orders").then((res) => setOrders(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedBeer || !selectedFriend || quantity == 0) {
      alert(
        "Selecciona una cerveza, el amigo que hace el pedido y una cantidad."
      );
      return;
    }

    const beer = beers.find((b) => b.name === selectedBeer);
    if (!beer) return;

    const newItem = {
      name: beer.name,
      quantity,
      price_per_unit: beer.price,
    };

    try {
      let orderId = selectedOrder;

      if (!selectedOrder) {
        // Crear una nueva orden si no se seleccionó ninguna
        const newOrderResponse = await axios.post("/order", {
          items: [newItem],
          ordered_by: selectedFriend,
        });
        orderId = newOrderResponse.data.id;
      } else {
        // Agregar a una orden existente
        await axios.put(`/order`, {
          items: [newItem],
          ordered_by: selectedFriend,
          order_id: selectedOrder,
        });
      }

      // Actualizar las órdenes
      const updatedOrders = await axios.get("/orders");
      const updatedBeers = await axios.get("/beers");
      setOrders(updatedOrders.data);
      setBeers(updatedBeers.data.beers);
    } catch (error) {
      console.error("Error al agregar al pedido:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="secondary"
        gutterBottom
        align="center"
      >
        Hacer un pedido
      </Typography>

      <Grid container spacing={2}>
        {/* Seleccionar orden */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Selecciona una orden"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(parseInt(e.target.value))}
          >
            <MenuItem value={0}>Nueva Orden</MenuItem>
            {orders &&
              orders
                .filter((x) => x.paid == false)
                .map((order) => (
                  <MenuItem key={order.id} value={order.id}>
                    Orden #{order.id} - {order.created}
                  </MenuItem>
                ))}
          </TextField>
        </Grid>

        {/* Seleccionar amigo */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Quién ordena?"
            value={selectedFriend}
            onChange={(e) => setSelectedFriend(e.target.value)}
          >
            {friends.map((friend) => (
              <MenuItem key={friend} value={friend}>
                {friend}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Seleccionar cerveza */}
        <Grid item xs={8}>
          <TextField
            select
            fullWidth
            label="Selecciona una cerveza"
            value={selectedBeer}
            onChange={(e) => setSelectedBeer(e.target.value)}
          >
            {beers.map((beer) => (
              <MenuItem key={beer.name} value={beer.name}>
                {beer.name} - ${beer.price.toFixed(2)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Seleccionar cantidad */}
        <Grid item xs={4}>
          <TextField
            fullWidth
            type="number"
            label="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
        </Grid>

        {/* Botón de agregar */}
        <Grid item xs={12} className="text-center">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Agregar Pedido
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
