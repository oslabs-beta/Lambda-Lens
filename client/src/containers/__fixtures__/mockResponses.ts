// client/src/containers/__fixtures__/mockResponses.ts
export const successfulResponse = {
  ok: true,
  json: async () => ({ result: "Success response" }),
};

export const errorResponse = {
  ok: false,
  status: 500,
  json: async () => ({ error: "Internal Server Error" }),
};

export const emptyResultResponse = {
  ok: true,
  json: async () => ({}),
};
