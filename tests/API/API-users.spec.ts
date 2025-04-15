import { test, expect } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { generateUser } from '../../shared/UserData';
import { validationMessages } from '../../messages/validationMessages';
import { userData } from '../../data/userData';

test.describe('Users API Tests', () => {
    let sharedSteps: SharedSteps;
    const BASE_URL = "https://automationexercise.com/api/";
    const CREATE_ACCOUNT_ENDPOINT = BASE_URL + "createAccount";
    const VERIFY_LOGIN_ENDPOINT = BASE_URL + "verifyLogin";
    const GET_USER_DETAIL_ENDPOINT = BASE_URL + "getUserDetailByEmail";
    const DELETE_ACCOUNT_ENDPOINT = BASE_URL + "deleteAccount";
    const UPDATE_ACCOUNT_ENDPOINT = BASE_URL + "updateAccount";
    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
    });

    test('07 - POST /api/verifyLogin with valid credentials returns success', async ({ request }) => {
        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('email', userData.validUsername);
        formData.append('password', userData.validPassword);

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
        expect(responseBody.message).toBe(validationMessages.userExistsMessage);
    });

    test('08 - POST /api/verifyLogin without email parameter returns 400', async ({ request }) => {
        // Prepare form data with only password
        const formData = new URLSearchParams();
        formData.append('password', userData.validPassword);

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
        formData.append('email', userData.invalidUsername);
        formData.append('password', userData.invalidPassword);

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

    test('13 - PUT /api/updateAccount - Update user account with valid data', async ({ request }) => {
        // Create initial test user
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

        // Create the initial user account
        await request.post(CREATE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });

        // Prepare update data
        const updateData = new URLSearchParams();
        updateData.append('name', 'Mat');
        updateData.append('email', user.email);
        updateData.append('password', user.password);
        updateData.append('title', 'Mr');
        updateData.append('birth_date', '14');
        updateData.append('birth_month', 'november');
        updateData.append('birth_year', '1995');
        updateData.append('firstname', 'John');
        updateData.append('lastname', 'Tudor');
        updateData.append('company', 'Space Y');
        updateData.append('address1', 'bul.Freedom');
        updateData.append('address2', 'str.Doom');
        updateData.append('country', 'United States');
        updateData.append('zipcode', '15847');
        updateData.append('state', 'Utah');
        updateData.append('city', 'Orem');
        updateData.append('mobile_number', '+397114779');

        // Send PUT request to update user
        const response = await request.put(UPDATE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: updateData.toString()
        });

        // Verify response status is 200
        expect(response.status()).toBe(200);

        // Parse and verify response body
        const responseBody = await response.json();

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe(validationMessages.userUpdatedMessage);

        // Clean up - delete test user
        const deleteData = new URLSearchParams();
        deleteData.append('email', user.email);
        deleteData.append('password', user.password);
        await request.delete(DELETE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: deleteData.toString()
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
        createFormData.append('birth_date', user.dateOfBirth.day);
        createFormData.append('birth_month', user.dateOfBirth.month);
        createFormData.append('birth_year', user.dateOfBirth.year);
        createFormData.append('firstname', user.firstName);
        createFormData.append('lastname', user.lastName);
        createFormData.append('company', user.company);
        createFormData.append('address1', user.address1);
        createFormData.append('address2', user.address2);
        createFormData.append('country', user.country);
        createFormData.append('state', user.state);
        createFormData.append('city', user.city);
        createFormData.append('zipcode', user.zipcode);
        createFormData.append('mobile_number', user.mobileNumber);

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
        expect(userDetail.name).toBe(user.name);
        expect(userDetail.title).toBe(user.title);
        expect(userDetail.birth_day).toBe(user.dateOfBirth.day);
        expect(userDetail.birth_month).toBe(user.dateOfBirth.month);
        expect(userDetail.birth_year).toBe(user.dateOfBirth.year);
        expect(userDetail.first_name).toBe(user.firstName);
        expect(userDetail.last_name).toBe(user.lastName);
        expect(userDetail.company).toBe(user.company);
        expect(userDetail.address1).toBe(user.address1);
        expect(userDetail.address2).toBe(user.address2);
        expect(userDetail.country).toBe(user.country);
        expect(userDetail.state).toBe(user.state);
        expect(userDetail.city).toBe(user.city);
        expect(userDetail.zipcode).toBe(user.zipcode);
        //expect(userDetail.mobile_number).toBe(user.mobileNumber);

        // Clean up - delete test user
        const deleteData = new URLSearchParams();
        deleteData.append('email', user.email);
        deleteData.append('password', user.password);
        await request.delete(DELETE_ACCOUNT_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: deleteData.toString()
        });
    });
});
