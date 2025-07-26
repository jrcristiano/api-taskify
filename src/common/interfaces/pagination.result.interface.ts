import { HttpStatusCode } from "../enums/http.status.code.enum";

export interface IPaginationResult<T> {
	data: T[];
	meta: {
		total: number;
		lastPage: number;
		currentPage: number;
		perPage: number;
		prev: number | null;
		next: number | null;
	};
}
