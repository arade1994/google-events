import { afterAll, afterEach, vi } from "vitest";

import { cleanup, configure } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.useRealTimers();
});

configure({ testIdAttribute: "id" });
