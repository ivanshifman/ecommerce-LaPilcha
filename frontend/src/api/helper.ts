export interface ApiResponse<T> {
    data: T;
    success: boolean;
    timestamp: string;
}

export const unwrapResponse = <T>(response: ApiResponse<T> | T): T => {
    if (response && typeof response === 'object' && 'data' in response) {
        return (response as ApiResponse<T>).data;
    }
    return response as T;
};