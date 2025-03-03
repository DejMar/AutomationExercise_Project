import { test, expect } from '@playwright/test';

test.only('GET /api/productsList returns product list successfully', async ({ request }) => {
    // Send GET request to products list endpoint
    const response = await request.get('https://automationexercise.com/api/productsList');

    // Verify response status is 200
    expect(response.status()).toBe(200);

    // Parse response body
    const responseBody = await response.json();

    // Find product with ID 1 and verify its properties
    const product1 = responseBody.products.find(product => product.id === 1);
    expect(product1).toBeDefined();
    expect(product1.name).toBe('Blue Top');
    expect(product1.price).toBe('Rs. 500');
    expect(product1.category.category).toBe('Tops');
    expect(product1.category.usertype.usertype).toBe('Women');
    expect(product1.brand).toBe('Polo');
});
