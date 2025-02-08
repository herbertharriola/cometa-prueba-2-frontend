import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Order } from "../types";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Orden #{order.name}</Typography>
        <Typography variant="body2">Fecha: {order.created}</Typography>
        <List>
          {order.items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${item.name} x ${item.quantity}`} secondary={`$${item.total.toFixed(2)}`} />
            </ListItem>
          ))}
        </List>
        <Typography variant="subtitle1">Subtotal: ${order.subtotal.toFixed(2)}</Typography>
        <Typography variant="subtitle1">Impuestos: ${order.taxes.toFixed(2)}</Typography>
        <Typography variant="subtitle1">Total: ${order.total.toFixed(2)}</Typography>
      </CardContent>
    </Card>
  );
}
