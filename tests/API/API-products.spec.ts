import { test, expect } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import * as fs from 'fs/promises';
import { generateUser } from '../../shared/UserData';

test.describe('Product API Tests', () => {
    let sharedSteps: SharedSteps;
    const BASE_URL = "https://automationexercise.com/api/";
    const BRANDS_LIST_ENDPOINT = BASE_URL + "brandsList";
    const PRODUCTS_LIST_ENDPOINT = BASE_URL + "productsList";
    const SEARCH_PRODUCT_ENDPOINT = BASE_URL + "searchProduct";

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
    });

    test('01 - GET /api/productsList returns product list successfully', async ({ request }) => {
        // Send GET request to products list endpoint
        const response = await request.get(PRODUCTS_LIST_ENDPOINT);

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

    test('02 - POST /api/productsList returns method not supported', async ({ request }) => {
        // Send POST request to products list endpoint
        const response = await request.post(PRODUCTS_LIST_ENDPOINT);

        // Verify response status is 405
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify error message
        expect(responseBody.responseCode).toBe(405);
        expect(responseBody.message).toBe('This request method is not supported.');
    });

    test('03 - GET /api/brandsList returns brands list successfully', async ({ request }) => {
        // Send GET request to brands list endpoint
        const response = await request.get(BRANDS_LIST_ENDPOINT);

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code
        // Save response to file for comparison
        await fs.writeFile('test-results/responseBody.json', JSON.stringify(responseBody, null, 2));

        // Find brand with ID 1 and verify its name
        const brand1 = responseBody.brands.find((brand: { id: number, brand: string }) => brand.id === 1);
        expect(brand1.brand).toBe('Polo');

        // Compare response with brands.json file
        const areJsonsEqual = await sharedSteps.compareJsonFiles('../data', 'brands.json', '../test-results', 'responseBody.json');
        expect(areJsonsEqual).toBe(true);
    });

    test('04 - PUT /api/brandsList returns method not supported', async ({ request }) => {
        // Send PUT request to brands list endpoint
        const response = await request.put(BRANDS_LIST_ENDPOINT);

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify error message
        expect(responseBody.responseCode).toBe(405);
        expect(responseBody.message).toBe('This request method is not supported.');
    });

    test('05 - POST /api/searchProduct returns searched products list', async ({ request }) => {
        // Create form data with search parameter
        const formData = new URLSearchParams();
        formData.append('search_product', 'top');

        // Send POST request with search parameter
        const response = await request.post(SEARCH_PRODUCT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code
        expect(responseBody.responseCode).toBe(200);

        // Verify products array exists and is not empty
        //expect(responseBody.products).toBeDefined();
        expect(Array.isArray(responseBody.products)).toBe(true);
        expect(responseBody.products.length).toBeGreaterThan(0);

        // Verify each product has required properties
        responseBody.products.forEach(product => {
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('brand');
        });
    });

    test('06 - POST /api/searchProduct without search parameter returns 400', async ({ request }) => {
        // Send POST request without search parameter
        const response = await request.post(SEARCH_PRODUCT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Verify response status is 200 (API returns 200 even for error cases)
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code is 400
        expect(responseBody.responseCode).toBe(400);

        // Verify error message
        expect(responseBody.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });
});
