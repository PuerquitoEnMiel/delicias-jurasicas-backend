/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                // ==========================================
                // PALETA PRINCIPAL - DELICIAS JURÁSICAS
                // ==========================================

                // BEIGE - Color base cálido y acogedor (#F5E6A8)
                beige: {
                    50: '#fdfcf8',   // Casi blanco con tinte beige
                    100: '#fbf7ed',  // Muy claro para fondos amplios
                    200: '#f8f0db',  // Claro para cards hover
                    300: '#F5E6A8',  // BASE - Color principal beige
                    400: '#f0dd88',  // Intermedio
                    500: '#ebd468',  // Saturado
                    600: '#d9c04d',  // Oscuro para texto
                    700: '#b89a3f',  // Más oscuro
                    800: '#8f7831',  // Bordes fuertes
                    900: '#6b5a26',  // Muy oscuro
                },

                // VERDE - Color distintivo de marca (#ACEB8D)
                verde: {
                    50: '#f4fcf2',   // Muy suave para fondos
                    100: '#e6f8e0',  // Claro para success states
                    200: '#d0f3c4',  // Hover claro
                    300: '#ACEB8D',  // BASE - Verde fresco característico
                    400: '#8de46d',  // Brillante
                    500: '#6dd94e',  // Saturado para CTAs
                    600: '#52c036',  // Oscuro para hover
                    700: '#42a02c',  // Más oscuro
                    800: '#347f23',  // Texto verde oscuro
                    900: '#28641c',  // Muy oscuro
                },

                // AMARILLO - Acentos energéticos (#DBD749)
                amarillo: {
                    50: '#fefef4',   // Casi blanco amarillento
                    100: '#fdfce8',  // Muy claro
                    200: '#fcf9d1',  // Claro para fondos
                    300: '#f8f3a8',  // Suave
                    400: '#f1e876',  // Intermedio
                    500: '#DBD749',  // BASE - Amarillo intenso
                    600: '#c5c230',  // Oscuro
                    700: '#a5a327',  // Más oscuro
                    800: '#84811f',  // Texto amarillo oscuro
                    900: '#676519',  // Muy oscuro
                },

                // CHOCOLATE - Asociación con repostería (#8B5E3C)
                chocolate: {
                    50: '#f8f5f2',   // Beige muy claro
                    100: '#ede7e0',  // Claro
                    200: '#dccfc1',  // Intermedio claro
                    300: '#cab6a2',  // Suave
                    400: '#af907a',  // Medio
                    500: '#8B5E3C',  // BASE - Chocolate cálido
                    600: '#704b2f',  // Oscuro
                    700: '#583b26',  // Más oscuro para texto
                    800: '#412c1d',  // Muy oscuro
                    900: '#2e1f15',  // Casi negro chocolate
                },

                // NARANJA - Promociones y avisos (#F97316)
                naranja: {
                    50: '#fff9f1',   // Muy claro
                    100: '#fff0e0',  // Claro
                    200: '#ffddb8',  // Suave
                    300: '#ffc78f',  // Intermedio
                    400: '#ffa757',  // Brillante
                    500: '#F97316',  // BASE - Naranja energético
                    600: '#ea5d0c',  // Oscuro
                    700: '#c2480a',  // Más oscuro
                    800: '#9a3708',  // Muy oscuro
                    900: '#7c2c06',  // Casi marrón
                },

                // ==========================================
                // NEUTROS DEL SISTEMA
                // ==========================================

                // PRIMARY mapeado a VERDE (para consistencia)
                primary: {
                    50: '#f4fcf2',
                    100: '#e6f8e0',
                    200: '#d0f3c4',
                    300: '#ACEB8D',
                    400: '#8de46d',
                    500: '#6dd94e',   // Verde saturado para botones
                    600: '#52c036',
                    700: '#42a02c',
                    800: '#347f23',
                    900: '#28641c',
                },

                // SECONDARY mapeado a AMARILLO
                secondary: {
                    50: '#fefef4',
                    100: '#fdfce8',
                    200: '#fcf9d1',
                    300: '#f8f3a8',
                    400: '#f1e876',
                    500: '#DBD749',   // Amarillo intenso para CTAs secundarios
                    600: '#c5c230',
                    700: '#a5a327',
                    800: '#84811f',
                    900: '#676519',
                },
            },

            // Sombras personalizadas con colores cálidos
            boxShadow: {
                'warm': '0 1px 3px rgba(245, 230, 168, 0.2), 0 2px 6px rgba(217, 217, 217, 0.15)',
                'warm-md': '0 4px 6px rgba(245, 230, 168, 0.25), 0 8px 15px rgba(217, 217, 217, 0.2)',
                'warm-lg': '0 10px 25px rgba(245, 230, 168, 0.3), 0 8px 20px rgba(217, 217, 217, 0.25)',
                'warm-xl': '0 20px 40px rgba(245, 230, 168, 0.35), 0 10px 25px rgba(217, 217, 217, 0.3)',

                'verde': '0 4px 14px rgba(172, 235, 141, 0.4)',
                'amarillo': '0 4px 14px rgba(219, 215, 73, 0.4)',
                'chocolate': '0 4px 14px rgba(139, 94, 60, 0.3)',
            },

            animation: {
                'float': 'float 3s ease-in-out infinite',
                'fadeIn': 'fadeIn 0.5s ease-in',
            },

            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
