import { Review } from "./review";

export type NewReview = Pick<Review, 'text' | 'rating'>;