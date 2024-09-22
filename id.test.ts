import { test, expect, beforeAll, afterAll, describe } from "bun:test";
import { API_ENDPOINTS, generateMockUUID } from "./api.fixture";
import { setupMockFetch, teardownMockFetch, mockObjects } from "./mockSetup";

beforeAll(() => {
  setupMockFetch();
});

afterAll(() => {
  teardownMockFetch();
});

describe("Non-existent ID tests", () => {
  test("1. GET by ID request", async () => {
    const nonExistentId = generateMockUUID();
    const response = await fetch(`${API_ENDPOINTS.objects}/${nonExistentId}`);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ error: "Object not found" });
  });

  test("2. DELETE by ID request", async () => {
    const nonExistentId = generateMockUUID();
    const response = await fetch(`${API_ENDPOINTS.objects}/${nonExistentId}`, {
      method: 'DELETE',
    });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ error: "Object not found" });
  });
});