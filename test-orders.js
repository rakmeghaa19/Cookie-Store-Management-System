// Simple test script to verify order functionality
const API_BASE = "https://8080-fecafffabfdabaaeaedaacebfbabbcbebecf.premiumproject.examly.io";

async function testOrderAPI() {
    console.log('Testing Order API...');
    
    try {
        // Test 1: Get all orders
        console.log('\n1. Testing GET /api/orders');
        const response1 = await fetch(`${API_BASE}/api/orders`);
        console.log('Status:', response1.status);
        if (response1.ok) {
            const orders = await response1.json();
            console.log('Orders found:', orders.length);
            console.log('Sample order:', orders[0]);
        } else {
            console.log('Error:', await response1.text());
        }
        
        // Test 2: Get orders by customer
        console.log('\n2. Testing GET /api/orders/customer/testuser');
        const response2 = await fetch(`${API_BASE}/api/orders/customer/testuser`);
        console.log('Status:', response2.status);
        if (response2.ok) {
            const customerOrders = await response2.json();
            console.log('Customer orders found:', customerOrders.length);
        } else {
            console.log('Error:', await response2.text());
        }
        
        // Test 3: Create a test order
        console.log('\n3. Testing POST /api/orders');
        const testOrder = {
            customerName: "testuser",
            cookieName: "Chocolate Chip",
            quantity: 2,
            totalPrice: 10
        };
        
        const response3 = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testOrder)
        });
        
        console.log('Status:', response3.status);
        if (response3.ok) {
            const newOrder = await response3.json();
            console.log('Order created:', newOrder);
            
            // Test 4: Update order status
            console.log('\n4. Testing PUT /api/orders/' + newOrder.id + '/status');
            const response4 = await fetch(`${API_BASE}/api/orders/${newOrder.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'CANCELLED' })
            });
            
            console.log('Status:', response4.status);
            if (response4.ok) {
                const result = await response4.json();
                console.log('Status update result:', result);
            } else {
                console.log('Error:', await response4.text());
            }
        } else {
            console.log('Error creating order:', await response3.text());
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testOrderAPI();