export type PagedResponse<T> = {
    contents: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalContents: number
}