import { test, expect } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { generateUser } from '../../shared/UserData';
import { validationMessages } from '../../messages/validationMessages';

test.describe('Users API Tests', () => {
    let sharedSteps: SharedSteps;
    const CREATE_ACCOUNT_ENDPOINT = "https://automationexercise.com/api/createAccount";
    const VERIFY_LOGIN_ENDPOINT = "https://automationexercise.com/api/verifyLogin";
    const GET_USER_DETAIL_ENDPOINT = "https://automationexercise.com/api/getUserDetailByEmail";
    const DELETE_ACCOUNT_ENDPOINT = "https://automationexercise.com/api/deleteAccount";

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

    test('08 - POST /api/verifyLogin without email parameter returns 400', async ({ request }) => {
        // Prepare form data with only password
        const formData = new URLSearchParams();
        formData.append('password', 'testpassword');

        // Send POST request
        const response = await request.post(VERIFY_LOGIN_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });

        // Verify response status is 200 (API returns 200 even for error cases)
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code is 400
        expect(responseBody.responseCode).toBe(400);

        // Verify error message
        expect(responseBody.message).toBe(validationMessages.badRequestMessage);
    });

    test('09 - DELETE /api/verifyLogin returns method not supported', async ({ request }) => {
        // Send DELETE request
        const response = await request.delete(VERIFY_LOGIN_ENDPOINT);

        // Verify response status is 200 (API returns 200 even for error cases)
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code is 405
        expect(responseBody.responseCode).toBe(405);

        // Verify error message
        expect(responseBody.message).toBe(validationMessages.methodNotSupportedMessage);
    });

    test('10 - POST /api/verifyLogin with invalid credentials returns user not found', async ({ request }) => {
        // Create form data with invalid credentials
        const formData = new URLSearchParams();
        formData.append('email', 'invalid@email.com');
        formData.append('password', 'invalidpassword');

        // Send POST request
        const response = await request.post(VERIFY_LOGIN_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });

        // Verify response status is 200 (API returns 200 even for error cases)
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code is 404
        expect(responseBody.responseCode).toBe(404);

        // Verify error message
        expect(responseBody.message).toBe(validationMessages.userNotFoundMessage);
    });

    test('11 - POST /api/createAccount with valid data returns success', async ({ request }) => {
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
        expect(responseBody.message).toBe(validationMessages.userCreatedMessage);

        // Log user credentials for reference
        console.log('Created user credentials:');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${user.password}`);
    });

    test('12 - DELETE /api/deleteAccount with valid credentials deletes user account', async ({ request }) => {
        // First create a user to ensure we have valid credentials
        const user = generateUser();
        const formData = new URLSearchParams();
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('title', user.title);
        formData.append('name', user.name);
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

        // Create the user account
        await request.post(CREATE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });

        // Prepare delete request data
        const deleteFormData = new URLSearchParams();
        deleteFormData.append('email', user.email);
        deleteFormData.append('password', user.password);

        // Send DELETE request
        const response = await request.delete(DELETE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: deleteFormData.toString()
        });

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code
        expect(responseBody.responseCode).toBe(200);

        // Verify success message
        expect(responseBody.message).toBe(validationMessages.accountDeletedMessage);
    });
    
    test('13 - PUT /api/updateAccount updates user account details', async ({ request }) => {
        // Create a user first to ensure we have a valid account to update
        const originalUser = generateUser();
        const createFormData = new URLSearchParams();
        createFormData.append('email', originalUser.email);
        createFormData.append('password', originalUser.password);
        createFormData.append('title', originalUser.title);
        createFormData.append('name', originalUser.name);
        createFormData.append('birth_date', originalUser.dateOfBirth.day);
        createFormData.append('birth_month', originalUser.dateOfBirth.month);
        createFormData.append('birth_year', originalUser.dateOfBirth.year);
        createFormData.append('firstname', originalUser.firstName);
        createFormData.append('lastname', originalUser.lastName);
        createFormData.append('company', originalUser.company);
        createFormData.append('address1', originalUser.address1);
        createFormData.append('address2', originalUser.address2);
        createFormData.append('country', originalUser.country);
        createFormData.append('state', originalUser.state);
        createFormData.append('city', originalUser.city);
        createFormData.append('zipcode', originalUser.zipcode);
        createFormData.append('mobile_number', originalUser.mobileNumber);

        // Create the initial user account
        await request.post(CREATE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: createFormData.toString()
        });

        // Generate updated user data
        const updatedUser = generateUser();
        const updateFormData = new URLSearchParams();
        updateFormData.append('email', originalUser.email); // Keep original email for identification
        updateFormData.append('password', updatedUser.password);
        updateFormData.append('title', updatedUser.title);
        updateFormData.append('name', updatedUser.name);
        updateFormData.append('birth_date', updatedUser.dateOfBirth.day);
        updateFormData.append('birth_month', updatedUser.dateOfBirth.month);
        updateFormData.append('birth_year', updatedUser.dateOfBirth.year);
        updateFormData.append('firstname', updatedUser.firstName);
        updateFormData.append('lastname', updatedUser.lastName);
        updateFormData.append('company', updatedUser.company);
        updateFormData.append('address1', updatedUser.address1);
        updateFormData.append('address2', updatedUser.address2);
        updateFormData.append('country', updatedUser.country);
        updateFormData.append('state', updatedUser.state);
        updateFormData.append('city', updatedUser.city);
        updateFormData.append('zipcode', updatedUser.zipcode);
        updateFormData.append('mobile_number', updatedUser.mobileNumber);

        // Send PUT request to update user
        const response = await request.put('https://automationexercise.com/api/updateAccount', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: updateFormData.toString()
        });

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code
        expect(responseBody.responseCode).toBe(200);

        // Verify success message
        expect(responseBody.message).toBe('User updated!');

        // Clean up - delete the test user
        const deleteFormData = new URLSearchParams();
        deleteFormData.append('email', originalUser.email);
        deleteFormData.append('password', updatedUser.password);

        await request.delete(DELETE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: deleteFormData.toString()
        });
    });

    test('14 - GET /api/getUserDetailByEmail returns user details', async ({ request }) => {
        // Create a user first to ensure we have valid data to query
        const user = generateUser();
        const createFormData = new URLSearchParams();
        createFormData.append('email', user.email);
        createFormData.append('password', user.password);
        createFormData.append('title', user.title);
        createFormData.append('name', user.name);
        createFormData.append('email', user.email);
        createFormData.append('password', user.password);
        createFormData.append('birth_date', user.dateOfBirth.day);
        createFormData.append('birth_month', user.dateOfBirth.month);
        createFormData.append('birth_year', user.dateOfBirth.year);
        // Add other required user fields...

        // Create the user account
        await request.post(CREATE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: createFormData.toString()
        });

        // Prepare query parameters for GET request
        const params = new URLSearchParams();
        params.append('email', user.email);

        // Send GET request
        const response = await request.get(`${GET_USER_DETAIL_ENDPOINT}?${params.toString()}`);

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse response body
        const responseBody = await response.json();

        // Verify response code
        expect(responseBody.responseCode).toBe(200);

        // Verify user details are returned
        expect(responseBody.user).toBeDefined();
        const userDetail = responseBody.user;

        // Verify user properties match what we created
        expect(userDetail.email).toBe(user.email);
        expect(userDetail).toHaveProperty('name');
        expect(userDetail).toHaveProperty('title');
        expect(userDetail).toHaveProperty('birth_day');
        expect(userDetail).toHaveProperty('birth_month');
        expect(userDetail).toHaveProperty('birth_year');
        expect(userDetail).toHaveProperty('first_name');
        expect(userDetail).toHaveProperty('last_name');
        expect(userDetail).toHaveProperty('company');
        expect(userDetail).toHaveProperty('address1');
        expect(userDetail).toHaveProperty('address2');
        expect(userDetail).toHaveProperty('country');
        expect(userDetail).toHaveProperty('state');
        expect(userDetail).toHaveProperty('city');
        expect(userDetail).toHaveProperty('zipcode');
        expect(userDetail).toHaveProperty('mobile_number');
    });
});
