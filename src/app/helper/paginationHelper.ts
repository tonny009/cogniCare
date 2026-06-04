
export type IOptions = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}
const calculatePagination = (options: IOptions): IOptionsResult => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (Number(page) - 1) * limit;

    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: string = options.sortOrder || "desc";
    // here all fileds has default value if not provided in the request query.(1,10, createdAt, desc   )
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export const paginationHelper = {
    calculatePagination
}