'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    User,
    Mail,
    Phone,
    Edit2,
    Save,
    X,
    Package,
    DollarSign,
    Calendar,
    Shield,
    Loader2,
    Heart,
    Ruler,
} from 'lucide-react';
import { useAuth, useAuthActions } from '../../../store/authStore';
import { handleApiError } from '../../../api/error-handler';
import { showSuccess, showError } from '../../../lib/notifications';
import { profileSchema, UserSizePreference, UserColorPreference } from '../../../schemas/profile.schema';
import type { ProfileFormData } from '../../../schemas/profile.schema';

type SizeValue = (typeof UserSizePreference)[keyof typeof UserSizePreference];
type ColorValue = UserColorPreference;

const isSizeValue = (value: any): value is SizeValue => {
    return Object.values(UserSizePreference).includes(value);
};
const isColorValue = (value: any): value is ColorValue => {
    return Object.values(UserColorPreference).includes(value);
};


const allSizes = Object.values(UserSizePreference) as SizeValue[];
const LETTER_SIZES = allSizes.filter((s) => isNaN(Number(s))) as SizeValue[];
const NUMBER_SIZES = allSizes.filter((s) => !isNaN(Number(s))) as SizeValue[];
const COLORS = Object.values(UserColorPreference);

const COLOR_LABELS: Record<UserColorPreference, string> = {
    [UserColorPreference.BLACK]: 'Negro',
    [UserColorPreference.GRAY]: 'Gris',
    [UserColorPreference.BROWN]: 'Marrón',
    [UserColorPreference.WHITE]: 'Blanco',
    [UserColorPreference.BLUE]: 'Azul',
    [UserColorPreference.RED]: 'Rojo',
    [UserColorPreference.GREEN]: 'Verde',
    [UserColorPreference.YELLOW]: 'Amarillo',
    [UserColorPreference.NEUTRAL]: 'Neutral',
};

export default function ProfilePage() {
    const router = useRouter();
    const { profile, isAuthenticated, isLoading: authLoading } = useAuth();
    const { getProfile, updateProfile } = useAuthActions();

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            lastName: '',
            phone: '',
            avatar: '',
            preferences: {
                defaultSize: undefined,
                favoriteColors: [],
            },
        },
    });

    const selectedColors = watch('preferences.favoriteColors') || [];

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/profile');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            getProfile().catch(console.error);
        }
    }, [isAuthenticated, getProfile]);

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
                avatar: profile.avatar || '',
                preferences: {
                    defaultSize: isSizeValue(profile.preferences?.defaultSize)
                        ? profile.preferences?.defaultSize
                        : undefined,
                    favoriteColors: (profile.preferences?.favoriteColors || []).filter(
                        isColorValue
                    ),
                },
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        try {
            const cleanData = {
                name: data.name,
                lastName: data.lastName || undefined,
                phone: data.phone || undefined,
                avatar: data.avatar || undefined,
                preferences: {
                    defaultSize: data.preferences?.defaultSize,
                    favoriteColors: data.preferences?.favoriteColors?.length
                        ? data.preferences.favoriteColors
                        : undefined,
                },
            };

            await updateProfile(cleanData);
            showSuccess('Perfil actualizado exitosamente');
            setIsEditing(false);
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al actualizar perfil');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            reset({
                name: profile.name || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
                avatar: profile.avatar || '',
                preferences: {
                    defaultSize: isSizeValue(profile.preferences?.defaultSize)
                        ? profile.preferences?.defaultSize
                        : undefined,
                    favoriteColors: (profile.preferences?.favoriteColors || []).filter(
                        isColorValue
                    ),
                },
            });
        }
        setIsEditing(false);
    };

    if (authLoading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Mi Perfil</h1>
                    <p className="text-text-muted">Gestiona tu información personal y preferencias</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-text-primary">Información Personal</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Editar
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Nombre *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            {...register('name')}
                                            type="text"
                                            disabled={!isEditing}
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-destructive' : 'border-border'
                                                } ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                                            placeholder="Juan"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Apellido
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            {...register('lastName')}
                                            type="text"
                                            disabled={!isEditing}
                                            className={`w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${!isEditing ? 'bg-muted cursor-not-allowed' : ''
                                                }`}
                                            placeholder="Pérez"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            title='El email no puede ser modificado'
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">El email no puede ser modificado</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            {...register('phone')}
                                            type="tel"
                                            disabled={!isEditing}
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.phone ? 'border-destructive' : 'border-border'
                                                } ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                                            placeholder="+54 9 11 1234-5678"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Heart className="w-5 h-5 text-primary" />
                                        <h3 className="text-lg font-bold text-text-primary">Mis Preferencias</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-2 items-center gap-2">
                                                <Ruler className="w-4 h-4" />
                                                Talle Preferido
                                            </label>
                                            <Controller
                                                name="preferences.defaultSize"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-xs text-text-muted mb-2">Talles (Letras)</p>
                                                            <div className="grid grid-cols-6 gap-2">
                                                                {LETTER_SIZES.map((size) => (
                                                                    <button
                                                                        key={size}
                                                                        type="button"
                                                                        disabled={!isEditing}
                                                                        onClick={() => field.onChange(size)}
                                                                        className={`py-2 rounded-lg font-semibold text-sm transition-all ${field.value === size
                                                                            ? 'bg-primary text-white'
                                                                            : 'border-2 border-border hover:border-primary'
                                                                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-text-muted mb-2">Talles (Números)</p>
                                                            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                                                {NUMBER_SIZES.map((size) => (
                                                                    <button
                                                                        key={size}
                                                                        type="button"
                                                                        disabled={!isEditing}
                                                                        onClick={() => field.onChange(size)}
                                                                        className={`py-2 rounded-lg font-semibold text-sm transition-all ${field.value === size
                                                                            ? 'bg-primary text-white'
                                                                            : 'border-2 border-border hover:border-primary'
                                                                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {field.value && (
                                                            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                                                <p className="text-sm text-primary font-semibold">
                                                                    Talle seleccionado: {field.value}
                                                                </p>
                                                                {isEditing && (
                                                                    <button
                                                                        title="Quitar talle preferido"
                                                                        type="button"
                                                                        onClick={() => field.onChange(undefined)}
                                                                        className="text-primary hover:text-primary-dark"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-2">
                                                Colores Favoritos (selecciona varios)
                                            </label>
                                            <Controller
                                                name="preferences.favoriteColors"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                        {COLORS.map((color) => {
                                                            const isSelected = field.value?.includes(color);
                                                            return (
                                                                <button
                                                                    key={color}
                                                                    type="button"
                                                                    disabled={!isEditing}
                                                                    onClick={() => {
                                                                        const current = field.value || [];
                                                                        const newValue = isSelected
                                                                            ? current.filter((c) => c !== color)
                                                                            : [...current, color];
                                                                        field.onChange(newValue);
                                                                    }}
                                                                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${isSelected
                                                                        ? 'bg-primary text-white'
                                                                        : 'border-2 border-border hover:border-primary'
                                                                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                >
                                                                    {COLOR_LABELS[color]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            />
                                            {selectedColors.length > 0 && (
                                                <p className="text-xs text-text-muted mt-2">
                                                    {selectedColors.length} {selectedColors.length === 1 ? 'color seleccionado' : 'colores seleccionados'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-6">
                            <h2 className="text-xl font-bold text-text-primary mb-4">
                                Información de la Cuenta
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-3 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-text-primary">Estado del Email</p>
                                            <p className="text-sm text-text-muted">Verificación de cuenta</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${profile.emailVerified
                                            ? 'bg-success/10 text-success'
                                            : 'bg-warning/10 text-warning'
                                            }`}
                                    >
                                        {profile.emailVerified ? 'Verificado' : 'No Verificado'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-text-primary">Miembro desde</p>
                                            <p className="text-sm text-text-muted">
                                                {new Date(profile.createdAt!).toLocaleDateString('es-AR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {profile.lastLogin && (
                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-text-primary">Último acceso</p>
                                                <p className="text-sm text-text-muted">
                                                    {new Date(profile.lastLogin).toLocaleDateString('es-AR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-border rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                        {profile.totalOrders || 0}
                                    </p>
                                    <p className="text-sm text-text-muted">Órdenes Totales</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/orders')}
                                className="w-full py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
                            >
                                Ver Órdenes
                            </button>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-success" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                        ${(profile.totalSpent || 0).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-text-muted">Total Gastado</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-destructive/10 rounded-lg">
                                    <Heart className="w-6 h-6 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                        {profile.wishlist?.length || 0}
                                    </p>
                                    <p className="text-sm text-text-muted">Lista de Deseos</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/wishlist')}
                                className="w-full py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
                            >
                                Ver Lista
                            </button>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-6">
                            <h3 className="font-bold text-text-primary mb-4">Acciones Rápidas</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => router.push('/products')}
                                    className="w-full py-2 text-sm text-text-primary border border-border rounded-lg hover:bg-accent transition-colors text-left px-4 cursor-pointer"
                                >
                                    Explorar Productos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
