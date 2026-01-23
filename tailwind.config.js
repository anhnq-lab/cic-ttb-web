/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './App.tsx',
        './constants.tsx',
        './types.ts',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#004488',
                    darkBlue: '#0a192f',
                    orange: '#ff9900',
                    lightBlue: '#e6f0fa',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        }
    },
    plugins: []
}
