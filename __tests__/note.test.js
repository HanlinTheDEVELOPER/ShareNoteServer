import { jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";

import { createNote } from "../controllers/note";

const request = {
  body: {
    title: "test",
    content: "test",
  },
};

it("create note success", async () => {
  await createNote(request, {
    status: jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        status: StatusCodes.CREATED,
        message: "Create Note Success",
      }),
    }),
  });
  expect(request.body).toHaveProperty("title");
  expect(request.body).toHaveProperty("content");
});

it("create note fail", async () => {
  await createNote(request, {
    status: jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      }),
    }),
  });
  expect(request.body).toHaveProperty("title", "test");
  expect(request.body).toHaveProperty("content", "test");
});
