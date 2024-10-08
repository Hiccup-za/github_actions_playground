import { test, expect, beforeAll, afterAll, describe } from "bun:test";
import { API_ENDPOINTS, generateMockUUID } from "./api.fixture";
import { setupMockFetch, teardownMockFetch, mockObjects } from "./mockSetup";

beforeAll(() => {
  setupMockFetch();
});

afterAll(() => {
  teardownMockFetch();
});

describe("API E2E Test", () => {
  let createdId: string;

  test("1. GET request - ensure no objects are initially present", async () => {
    const response = await fetch(API_ENDPOINTS.objects);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  test("2. POST request - create a new object", async () => {
    const newObjectName = "This is a Bun";
    const response = await fetch(API_ENDPOINTS.objects, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newObjectName }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(typeof data.id).toBe('string');
    expect(data.name).toBe(newObjectName);
    createdId = data.id;
  });

  test("3. GET request - assert that there is one object with expected ID and Name", async () => {
    const response = await fetch(API_ENDPOINTS.objects);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({ id: createdId, name: "This is a Bun" });
  });

  test("4. GET by ID request - assert that the object with the specific ID is returned", async () => {
    const response = await fetch(`${API_ENDPOINTS.objects}/${createdId}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ id: createdId, name: "This is a Bun" });
  });

  test("5. DELETE request - delete the created object", async () => {
    const response = await fetch(`${API_ENDPOINTS.objects}/${createdId}`, {
      method: 'DELETE',
    });
    expect(response.status).toBe(204);
  });

  test("6. GET request - verify that the object no longer exists and the array is empty", async () => {
    const response = await fetch(API_ENDPOINTS.objects);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });
});