export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
  meta?: any | PaginationMeta;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "STAFF";
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface PaginationMeta {
  totalItems: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
}

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  search?: string;
}