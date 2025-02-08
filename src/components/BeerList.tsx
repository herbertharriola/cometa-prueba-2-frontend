import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Beer } from "../types";

interface BeerListProps {
  beers: Beer[];
}

export default function BeerList({ beers }: BeerListProps) {
  return (
    <Grid container spacing={2}>
      {beers.map((beer) => (
        <Grid item xs={12} sm={6} md={6} key={beer.name}>
          <Card
            sx={{
              backgroundColor: beer.quantity == 0 ? "#f8705e" : "#515151",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">{beer.name}</Typography>
              <Typography variant="body2">
                Precio: ${beer.price.toFixed(2)}
              </Typography>
              <Typography variant="body2">Stock: {beer.quantity}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
