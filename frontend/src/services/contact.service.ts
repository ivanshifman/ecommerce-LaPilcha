import { apiClient } from '../api/axios-client';
import { ApiResponse, unwrapResponse } from '../api/helper';
import { ContactFormData, ContactResponse } from '../types/contact.types';

export const contactService = {
    sendMessage: async (data: ContactFormData): Promise<ContactResponse> => {
        const response = await apiClient.post<ApiResponse<ContactResponse>>(
            '/contact/send',
            data
        );
        return unwrapResponse(response.data);
    },
};