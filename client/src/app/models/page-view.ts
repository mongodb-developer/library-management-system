export const PAGE_SIZE = 10;

export interface Page<T> {
    data: T[];
    totalCount: number;
}
