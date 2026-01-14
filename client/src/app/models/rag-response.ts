import { Book } from "./book";

export interface RagResponse {
    answer: string;
    books?: Book[];
  }
  