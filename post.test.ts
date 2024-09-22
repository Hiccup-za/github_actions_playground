import { test, expect, beforeAll, afterAll, describe } from "bun:test";
import { API_ENDPOINTS, generateMockUUID } from "./api.fixture";
import { setupMockFetch, teardownMockFetch, mockObjects } from "./mockSetup";

beforeAll(() => {
  setupMockFetch();
});

afterAll(() => {
  teardownMockFetch();
});

describe("POST - empty name test", () => {
  test("1. GET request - ensure no objects are initially present", async () => {
    const response = await fetch(API_ENDPOINTS.objects);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  test("2. POST request - create a new object with an empty name", async () => {
    const response = await fetch(API_ENDPOINTS.objects, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: "Name cannot be empty" });
  });

  test("3. GET request - ensure no objects were created", async () => {
    const response = await fetch(API_ENDPOINTS.objects);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });
});