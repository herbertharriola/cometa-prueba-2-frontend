import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import axios from "../services/api";
import { Order } from "../types";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    axios.get("/orders").then((res) => setOrders(res.data));
  }, []);

  const fetchOrderDetails = async (orderId: number) => {
    if (!orderId) {
      setCurrentOrder(null);
      return;
    }
    try {
      const res = await axios.get(`/order/${orderId}`);
      setCurrentOrder(res.data);
    } catch (error) {
      console.error("Error obteniendo detalles de la orden:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="flex-end"  sx={{ marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/")}
          >
            ⬅ Regresar
          </Button>
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          📋 Ver cuenta
        </Typography>

        <Select
          fullWidth
          value={selectedOrder}
          onChange={(e) => {
            setSelectedOrder(Number(e.target.value));
            fetchOrderDetails(Number(e.target.value));
          }}
          displayEmpty
        >
          <MenuItem value={0}>Selecciona una orden</MenuItem>
          {orders &&
            orders.map((order) => (
              <MenuItem key={order.id} value={order.id}>
                Orden #{order.id} - {order.created}
              </MenuItem>
            ))}
        </Select>

        {currentOrder && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              {/* Si la orden está pagada, mostrar tarjeta PAID */}
              {currentOrder.paid && (
                <Box
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    textAlign: "center",
                    borderRadius: 1,
                    p: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    ✅ PAGADA
                  </Typography>
                </Box>
              )}
              <Typography variant="h5" fontWeight="bold">
                Orden #{currentOrder.id}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Fecha: {currentOrder.created}
              </Typography>
              <List>
                {currentOrder.items.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`${item.name} x ${item.quantity}`}
                      secondary={`Total: $${item.total.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Subtotal: ${currentOrder.subtotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    align="right"
                  >
                    Taxes: ${currentOrder.taxes.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    align="right"
                  >
                    Total: ${currentOrder.total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
}
