// jest.setup.ts

import "@testing-library/jest-dom";

// Mock global fetch
global.fetch = jest.fn();
