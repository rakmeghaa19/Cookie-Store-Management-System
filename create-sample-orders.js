// Script to create sample orders in localStorage for testing
const sampleOrders = [
  {
    id: Date.now() + 1,
    customerName: "testuser",
    items: [
      {
        id: 1,
        cookieName: "Chocolate Chip Cookie",
        flavor: "Chocolate",
        quantity: 3,
        price: 5
      }
    ],
    total: 15,
    status: "PENDING",
    date: new Date().toISOString(),
    paymentMethod: "card",
    deliveryOption: "delivery",
    notes: "Please deliver after 6 PM"
  },
  {
    id: Date.now() + 2,
    customerName: "testuser",
    items: [
      {
        id: 2,
        cookieName: "Oatmeal Raisin Cookie",
        flavor: "Oatmeal",
        quantity: 2,
        price: 4
      }
    ],
    total: 8,
    status: "CONFIRMED",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    paymentMethod: "cash",
    deliveryOption: "pickup"
  },
  {
    id: Date.now() + 3,
    customerName: "testuser",
    items: [
      {
        id: 3,
        cookieName: "Sugar Cookie",
        flavor: "Vanilla",
        quantity: 5,
        price: 3
      }
    ],
    total: 15,
    status: "COMPLETED",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    paymentMethod: "card",
    deliveryOption: "delivery"
  }
];

// Store in localStorage
localStorage.setItem('orders_testuser', JSON.stringify(sampleOrders));
console.log('Sample orders created for testuser:', sampleOrders);