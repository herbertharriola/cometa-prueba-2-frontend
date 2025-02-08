export type Beer = {
  name: string;
  price: number;
  quantity: number;
};

export type Friend = {
  name: string;
}

export type OrderItem = {
  name: string;
  quantity: number;
  price_per_unit: number;
  total: number;
  ordered_by: string;
};

export type Order = {
  id: number;
  created: string;
  paid: boolean;
  subtotal: number;
  taxes: number;
  total: number;
  items: OrderItem[];
  payments: any;
};
