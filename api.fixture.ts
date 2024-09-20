export const API_BASE_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  objects: `${API_BASE_URL}/api/objects`,
};

export const MOCK_RESPONSES = {
  emptyArray: [],
  createdObject: (name: string, id: string) => ({ id, name }),
};

// Helper function to generate a mock UUID
export const generateMockUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});