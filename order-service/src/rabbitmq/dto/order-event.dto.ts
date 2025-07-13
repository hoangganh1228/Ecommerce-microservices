export class OrderCreatedEventDto {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  orderTotal: number;
  orderItems: OrderItemDto[];
  shippingAddress?: string;
  note?: string;
  createdAt: string;
  status: string;
}

export class OrderItemDto {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  finalPrice: number;
}

export class OrderUpdatedEventDto {
  orderId: string;
  userId: string;
  userEmail: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
}