import { test, expect } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import * as fs from 'fs/promises';
import { generateUser } from '../../shared/UserData';

test.describe('Users API Tests', () => {
    let sharedSteps: SharedSteps;
    const CREATE_ACCOUNT_ENDPOINT = "https://automationexercise.com/api/createAccount";
    const VERIFY_LOGIN_ENDPOINT = "https://automationexercise.com/api/verifyLogin";

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
    });

    test('07 - POST /api/verifyLogin with valid credentials returns success', async ({ request }) => {
        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('email', 'Ana_Kihn2@hotmail.com');
        formData.append('password', 'gVkmR3KjKdeKIE2');

        // Send POST request
        const response = await request.post(VERIFY_LOGIN_ENDPOINT, {
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

        // Verify success message
        expect(responseBody.message).toBe('User exists!');
    });

    test('08 - POST /api/createAccount with valid data returns success', async ({ request }) => {
        // Prepare form data
        const user = generateUser();
        const formData = new URLSearchParams();
        formData.append('title', user.title);
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('birth_date', user.dateOfBirth.day);
        formData.append('birth_month', user.dateOfBirth.month);
        formData.append('birth_year', user.dateOfBirth.year);
        formData.append('firstname', user.firstName);
        formData.append('lastname', user.lastName);
        formData.append('company', user.company);
        formData.append('address1', user.address1);
        formData.append('address2', user.address2);
        formData.append('country', user.country);
        formData.append('state', user.state);
        formData.append('city', user.city);
        formData.append('zipcode', user.zipcode);
        formData.append('mobile_number', user.mobileNumber);

        // Send POST request
        const response = await request.post(CREATE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });

        // Verify response status is 200 (API returns 200 even though response code is 201)
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code is 201
        expect(responseBody.responseCode).toBe(201);

        // Verify success message
        expect(responseBody.message).toBe('User created!');

        // Log user credentials for reference
        console.log('Created user credentials:');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${user.password}`);
    });
});
