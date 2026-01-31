import Link from 'next/link';
import { Heart, Award, Truck, Shield, Users, MapPin, Target, Sparkles } from 'lucide-react';
import { COMPANY_INFO, CONTACT_INFO } from '../../../lib/constants/contact';

const VALUES = [
    {
        icon: Heart,
        title: 'Pasión',
        description: 'Amamos lo que hacemos y se refleja en cada prenda que ofrecemos.',
    },
    {
        icon: Award,
        title: 'Calidad',
        description: 'Seleccionamos cuidadosamente cada producto para garantizar tu satisfacción.',
    },
    {
        icon: Users,
        title: 'Comunidad',
        description: 'Construimos relaciones duraderas con nuestros clientes.',
    },
    {
        icon: Shield,
        title: 'Confianza',
        description: 'Tu seguridad y satisfacción son nuestra prioridad número uno.',
    },
];

const FEATURES = [
    {
        icon: Truck,
        title: 'Envíos a Todo el País',
        description: 'Llegamos a todos los rincones de Argentina con envíos seguros y tracking en tiempo real.',
    },
    {
        icon: Shield,
        title: 'Compra Segura',
        description: 'Protegemos tus datos con tecnología de encriptación de última generación.',
    },
    {
        icon: Sparkles,
        title: 'Productos Seleccionados',
        description: 'Cada prenda es elegida pensando en calidad, comodidad y estilo auténtico.',
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="bg-campo-gradient">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                            Sobre {COMPANY_INFO.name}
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed">
                            {COMPANY_INFO.slogan}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-accent">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8">
                                <Heart className="w-20 h-20 text-primary mx-auto mb-4" />
                                <p className="text-text-muted">Imagen representativa</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                            Nuestra Historia
                        </h2>
                        <div className="space-y-4 text-text-secondary leading-relaxed">
                            <p>
                                {COMPANY_INFO.name} nació en {COMPANY_INFO.foundedYear} con una visión clara:
                                acercar moda argentina de calidad a todo el país a través de una experiencia
                                de compra online confiable y accesible.
                            </p>
                            <p>
                                Comenzamos como un pequeño proyecto con el objetivo de ofrecer productos
                                cuidadosamente seleccionados que combinan estilo, comodidad y autenticidad.
                                Cada prenda que ofrecemos pasa por un riguroso proceso de selección.
                            </p>
                            <p>
                                Hoy seguimos creciendo con el mismo compromiso del primer día: ofrecer la
                                mejor experiencia de compra, productos de calidad y un servicio al cliente
                                que te haga sentir parte de nuestra familia.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-primary">
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">{CONTACT_INFO.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-y border-border">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="text-center md:text-left">
                            <div className="w-16 h-16 mx-auto md:mx-0 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">
                                Nuestra Misión
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                Hacer que la moda de calidad sea accesible para todos, ofreciendo una
                                experiencia de compra online simple, segura y satisfactoria. Queremos que
                                cada cliente encuentre prendas que reflejen su estilo único.
                            </p>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="w-16 h-16 mx-auto md:mx-0 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">
                                Nuestra Visión
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                Convertirnos en la tienda online de confianza para quienes buscan moda
                                argentina auténtica. Aspiramos a ser reconocidos por nuestra calidad,
                                atención al cliente y compromiso con la satisfacción de cada compra.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        Nuestros Valores
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Estos principios guían cada decisión que tomamos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={index}
                                className="text-center p-6 rounded-xl hover:bg-accent/50 transition-colors"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-text-secondary">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white border-y border-border">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            ¿Por Qué Elegirnos?
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Trabajamos cada día para brindarte la mejor experiencia
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-text-secondary">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-campo-gradient">
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        ¿Listo para Encontrar tu Estilo?
                    </h2>
                    <p className="text-lg text-text-secondary mb-8">
                        Descubre nuestra colección y encuentra las prendas perfectas para vos
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Explorar Productos
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                        >
                            Contactanos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}