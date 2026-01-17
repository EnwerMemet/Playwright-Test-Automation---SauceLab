import { test, expect } from '@playwright/test';

test.describe('Complete API CRUD Operations', () => {
    // Base URL for the stable test API
    const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

    test('should perform full CRUD lifecycle', async ({ request }) => {

        // 1. CREATE (POST)
        const createResponse = await request.post(baseUrl, {
            data: {
                title: 'New API Test',
                body: 'Testing CRUD',
                userId: 1
            }
        });
        expect(createResponse.status()).toBe(201);
        const createdData = await createResponse.json();
        expect(createdData.title).toBe('New API Test');
        const newId = createdData.id;

        // 2. READ (GET)
        // We fetch an existing item (ID 1) to verify reading works
        const getResponse = await request.get(`${baseUrl}/1`);
        expect(getResponse.ok()).toBeTruthy();
        const getData = await getResponse.json();
        expect(getData.id).toBe(1);
        expect(getData).toHaveProperty('title');

        // 3. UPDATE (PUT)
        const updateResponse = await request.put(`${baseUrl}/1`, {
            data: {
                id: 1,
                title: 'Updated Title',
                body: 'Updated Body',
                userId: 1
            }
        });
        expect(updateResponse.status()).toBe(200);
        const updatedData = await updateResponse.json();
        expect(updatedData.title).toBe('Updated Title');

        // 4. DELETE (DELETE)
        const deleteResponse = await request.delete(`${baseUrl}/1`);
        expect(deleteResponse.status()).toBe(200);
        // check if the response body is empty after deletion
        const deleteBody = await deleteResponse.json();
        expect(deleteBody).toEqual({});

        console.log('✅ Full CRUD lifecycle completed successfully');
    });
});