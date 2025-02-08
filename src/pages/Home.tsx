import { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../services/api";
import BeerList from "../components/BeerList";
import OrderForm from "../components/OrderForm";
import { Beer } from "../types";

export default function Home() {
  const [beers, setBeers] = useState<Beer[]>([]);

  // Obtener datos de cervezas y órdenes
  useEffect(() => {
    axios.get("/beers").then((res) => setBeers(res.data.beers));
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      {/* Título */}
      <Typography
        variant="h3"
        fontWeight="bold"
        color="primary"
        align="center"
        gutterBottom
      >
        🍺 Bar de Cervezas
      </Typography>

      {/* Sección de Cervezas y Formulario de Orden en dos columnas */}
      <Grid container spacing={4}>
        {/* Lista de Cervezas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="secondary"
              gutterBottom
              align="center"
            >
              Cervezas Disponibles
            </Typography>
            <BeerList beers={beers} />
          </Paper>
        </Grid>

        {/* Formulario de Pedido */}
        <Grid item xs={12} md={6}>
          <OrderForm beers={beers} setBeers={setBeers}/>
        </Grid>
      </Grid>

      {/* Botones para Navegación */}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/orders"
          >
            📋 Ver Órdenes
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            component={Link}
            to="/payments"
          >
            💳 Realizar Pago
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
