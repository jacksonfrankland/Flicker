const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: {
        mode: 'all',
        content: [
            './src/**/*.html',
            './src/**/*.svelte',
        ]
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
        maxHeight: {
            'full': '100%',
            'screen': '100vh',
            'xs': '20rem',
            'sm': '24rem',
            'md': '28rem',
            'lg': '32rem',
            'xl': '36rem',
            '2xl': '42rem',
            '3xl': '48rem',
            '4xl': '56rem',
            '5xl': '64rem',
            '6xl': '72rem',
        }
    },
    variants: {},
    plugins: [
        require('@tailwindcss/ui'),
        require('@tailwindcss/typography'),
    ]
}

