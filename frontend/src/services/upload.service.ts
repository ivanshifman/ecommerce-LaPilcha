import { apiClient } from '../api/axios-client';
import { ApiResponse, unwrapResponse } from '../api/helper';

interface UploadAvatarResponse {
    url: string;
    message: string;
}

class UploadService {
    async uploadAvatar(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await apiClient.post<ApiResponse<UploadAvatarResponse>>(
                '/users/me/upload-avatar',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const data = unwrapResponse(response.data);

            return data.url;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }

    async deleteAvatar(): Promise<void> {
        try {
            await apiClient.delete('/users/me/avatar');
        } catch (error) {
            console.error('Error deleting avatar:', error);
            throw error;
        }
    }

    validateImageFile(file: File, maxSizeMB = 5): { valid: boolean; error?: string } {
        if (!file.type.startsWith('image/')) {
            return { valid: false, error: 'El archivo debe ser una imagen' };
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            return { valid: false, error: `La imagen no puede superar los ${maxSizeMB}MB` };
        }

        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !validExtensions.includes(extension)) {
            return {
                valid: false,
                error: `Solo se permiten archivos: ${validExtensions.join(', ')}`
            };
        }

        return { valid: true };
    }

    async createPreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

export const uploadService = new UploadService();