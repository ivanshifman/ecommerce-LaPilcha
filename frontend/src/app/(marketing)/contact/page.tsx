'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '../../../lib/constants/contact';
import { showSuccess, showError } from '../../../lib/notifications';
import { contactService } from '../../../services/contact.service';
import { handleApiError } from '../../../api/error-handler';
import { useAuth } from '../../../store/authStore';
import { contactSchema, type ContactFormData } from '../../../schemas/contact.schema';
import { ContactPhoneInput } from '../../../components/forms/ContactPhoneInput';

export default function ContactPage() {
    const { user, isAuthenticated } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
    });

    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('phone', user.phone || '');
        }
    }, [isAuthenticated, user, setValue]);

    const onSubmit = async (data: ContactFormData) => {
        try {
            await contactService.sendMessage(data);
            setIsSuccess(true);
            showSuccess('Mensaje enviado exitosamente');

            if (isAuthenticated) {
                setValue('subject', '');
                setValue('message', '');
            } else {
                reset();
            }

            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            const apiError = handleApiError(error);
            showError(apiError.message || 'Error al enviar el mensaje');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-campo-gradient border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                            Contactanos
                        </h1>
                        <p className="text-xl text-text-secondary">
                            Estamos aquí para ayudarte. Envianos tu consulta y te responderemos a la brevedad.
                        </p>
                        {isAuthenticated && (
                            <p className="mt-4 text-sm text-primary">
                                ✓ Hola {user?.name}, tus datos ya están pre-cargados
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary mb-6">
                                Información de Contacto
                            </h2>
                            <p className="text-text-secondary mb-8">
                                Podés comunicarte con nosotros a través de cualquiera de estos medios
                            </p>
                        </div>

                        <div className="space-y-6">
                        <a
                            href={`mailto:${CONTACT_INFO.email}`}
                            className="flex items-start gap-4 p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow group"
                            >
                            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-semibold text-text-primary mb-1">Email</div>
                                <div className="text-sm text-text-secondary">{CONTACT_INFO.email}</div>
                            </div>
                        </a>

                        <a
                        href={`tel:${CONTACT_INFO.phoneRaw}`}
                        className="flex items-start gap-4 p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow group"
                            >
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="font-semibold text-text-primary mb-1">Teléfono</div>
                            <div className="text-sm text-text-secondary">{CONTACT_INFO.phone}</div>
                        </div>
                    </a>

                    <div className="flex items-start gap-4 p-4 bg-white border border-border rounded-lg">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="font-semibold text-text-primary mb-1">Ubicación</div>
                            <div className="text-sm text-text-secondary">{CONTACT_INFO.address}</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-semibold text-text-primary mb-2">
                        Horarios de Atención
                    </h3>
                    <div className="text-sm text-text-secondary space-y-1">
                        <p>Lunes a Viernes: 9:00 - 18:00</p>
                        <p>Sábados: 9:00 - 13:00</p>
                        <p>Domingos: Cerrado</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white border border-border rounded-lg p-6 md:p-8">
                    {isSuccess ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-text-primary mb-2">
                                ¡Mensaje Enviado!
                            </h3>
                            <p className="text-text-secondary mb-6">
                                Gracias por contactarnos. Te responderemos a la brevedad.
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
                            >
                                Enviar Otro Mensaje
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-text-primary mb-6">
                                Envíanos un Mensaje
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name')}
                                            disabled={isAuthenticated}
                                            className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed ${errors.name ? 'border-error' : ''
                                                }`}
                                            placeholder="Juan Pérez"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            {...register('email')}
                                            disabled={isAuthenticated}
                                            className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed ${errors.email ? 'border-error' : ''
                                                }`}
                                            placeholder="tu@email.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Teléfono
                                        </label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <ContactPhoneInput
                                                    error={errors.phone?.message}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Asunto *
                                        </label>
                                        <select
                                            {...register('subject')}
                                            className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.subject ? 'border-error' : ''
                                                }`}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Consulta General">Consulta General</option>
                                            <option value="Sobre mi Pedido">Sobre mi Pedido</option>
                                            <option value="Consulta de Producto">Consulta de Producto</option>
                                            <option value="Cambios y Devoluciones">Cambios y Devoluciones</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-error">{errors.subject.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        rows={6}
                                        className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${errors.message ? 'border-error' : ''
                                            }`}
                                        placeholder="Escribí tu consulta aquí..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-error">{errors.message.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Enviar Mensaje
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
            </div >
        </div >
    );
}