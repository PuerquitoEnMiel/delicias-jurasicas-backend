import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-chocolate-700 to-chocolate-900 text-beige-50 mt-auto border-t-4 border-amarillo-500">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-br from-chocolate-400 to-chocolate-600 rounded-full p-2.5 text-white shadow-lg border-2 border-chocolate-300">
                                <span className="text-2xl">🦖</span>
                            </div>
                            <h3 className="text-xl font-bold text-amarillo-300">Delicias Jurásicas</h3>
                        </div>
                        <p className="text-beige-200 text-sm leading-relaxed">
                            Pastelería y cafetería temática con los mejores pasteles
                            inspirados en dinosaurios. Sabor prehistórico, calidad moderna.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="p-2 bg-chocolate-600 hover:bg-verde-500 rounded-lg transition-colors duration-200 shadow-md">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-chocolate-600 hover:bg-verde-500 rounded-lg transition-colors duration-200 shadow-md">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-chocolate-600 hover:bg-verde-500 rounded-lg transition-colors duration-200 shadow-md">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-amarillo-300">Contacto</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-beige-200 hover:text-verde-300 transition-colors">
                                <div className="bg-chocolate-600 p-2 rounded-lg">
                                    <Phone className="w-4 h-4 text-verde-300" />
                                </div>
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-beige-200 hover:text-verde-300 transition-colors">
                                <div className="bg-chocolate-600 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 text-verde-300" />
                                </div>
                                <span>info@deliciasjurasicas.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-beige-200 hover:text-verde-300 transition-colors">
                                <div className="bg-chocolate-600 p-2 rounded-lg">
                                    <MapPin className="w-4 h-4 text-verde-300" />
                                </div>
                                <span>123 Calle Principal, Ciudad</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-amarillo-300">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="text-beige-200 hover:text-verde-300 hover:translate-x-1 inline-block transition-all duration-200">
                                    → Inicio
                                </a>
                            </li>
                            <li>
                                <a href="/shop" className="text-beige-200 hover:text-verde-300 hover:translate-x-1 inline-block transition-all duration-200">
                                    → Tienda
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-beige-200 hover:text-verde-300 hover:translate-x-1 inline-block transition-all duration-200">
                                    → Sobre Nosotros
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-beige-200 hover:text-verde-300 hover:translate-x-1 inline-block transition-all duration-200">
                                    → Contacto
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-chocolate-600">
                    <p className="text-center text-sm text-beige-300">
                        © {new Date().getFullYear()} <span className="text-amarillo-300 font-semibold">Delicias Jurásicas</span>. Todos los derechos reservados. Hecho con 🦖 y ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
}
