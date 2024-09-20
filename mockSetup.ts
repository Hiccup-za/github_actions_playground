import { mock } from "bun:test";
import { API_ENDPOINTS, generateMockUUID } from "./api.fixture";

// Mock storage for our objects
export let mockObjects: Array<{ id: string, name: string }> = [];

// Mock fetch globally
const originalFetch = global.fetch;
export const setupMockFetch = () => {
  global.fetch = mock((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';

    if (url.startsWith(API_ENDPOINTS.objects)) {
      if (method === 'GET') {
        const id = url.split('/').pop();
        if (id && id !== 'objects') {
          // GET by ID
          const object = mockObjects.find(obj => obj.id === id);
          if (object) {
            return Promise.resolve(new Response(JSON.stringify(object), { status: 200 }));
          }
          return Promise.resolve(new Response(JSON.stringify({ error: "Object not found" }), { status: 404 }));
        }
        // GET all
        return Promise.resolve(new Response(JSON.stringify(mockObjects), { status: 200 }));
      } else if (method === 'POST') {
        const body = JSON.parse(init?.body as string);
        if (!body.name || body.name.trim() === '') {
          return Promise.resolve(new Response(JSON.stringify({ error: "Name cannot be empty" }), { status: 400 }));
        }
        const newObject = {
          id: generateMockUUID(),
          name: body.name,
        };
        mockObjects.push(newObject);
        return Promise.resolve(new Response(JSON.stringify(newObject), { status: 201 }));
      } else if (method === 'DELETE') {
        const id = url.split('/').pop();
        const index = mockObjects.findIndex(obj => obj.id === id);
        if (index !== -1) {
          mockObjects.splice(index, 1);
          return Promise.resolve(new Response(null, { status: 204 }));
        }
        return Promise.resolve(new Response(JSON.stringify({ error: "Object not found" }), { status: 404 }));
      }
    }

    return Promise.reject(new Error(`Unhandled request to ${url}`));
  });
};

export const teardownMockFetch = () => {
  global.fetch = originalFetch;
  mockObjects = []; // Reset mock storage
};