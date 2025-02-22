/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				'100': 'rgb(var(--c-p-100,241 245 249) / <alpha-value>)',
  				'900': 'rgb(var(--c-p-900,15 23 42) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			'shadcn-primary': {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			slate: {
  				'25': 'rgb(var(--c-s-25,252 253 254) / <alpha-value>)',
  				'50': 'rgb(var(--c-s-50,248 250 252) / <alpha-value>)',
  				'100': 'rgb(var(--c-s-100,241 245 249) / <alpha-value>)',
  				'200': 'rgb(var(--c-s-200,226 232 240) / <alpha-value>)',
  				'300': 'rgb(var(--c-s-300,203 213 225) / <alpha-value>)',
  				'400': 'rgb(var(--c-s-400,148 163 184) / <alpha-value>)',
  				'500': 'rgb(var(--c-s-500,100 116 139) / <alpha-value>)',
  				'600': 'rgb(var(--c-s-600,71 85 105) / <alpha-value>)',
  				'700': 'rgb(var(--c-s-700,51 65 85) / <alpha-value>)',
  				'800': 'rgb(var(--c-s-800,30 41 59) / <alpha-value>)',
  				'900': 'rgb(var(--c-s-900,15 23 42) / <alpha-value>)',
  				'950': 'rgb(var(--c-s-950,2 6 23) / <alpha-value>)'
  			},
  			zinc: {
  				'50': 'rgb(var(--c-z-50,249 250 251) / <alpha-value>)',
  				'100': 'rgb(var(--c-z-100,243 244 246) / <alpha-value>)',
  				'200': 'rgb(var(--c-z-200,229 231 235) / <alpha-value>)',
  				'300': 'rgb(var(--c-z-300,209 213 219) / <alpha-value>)',
  				'400': 'rgb(var(--c-z-400,156 163 175) / <alpha-value>)',
  				'500': 'rgb(var(--c-z-500,107 114 128) / <alpha-value>)',
  				'600': 'rgb(var(--c-z-600,75 85 99) / <alpha-value>)',
  				'700': 'rgb(var(--c-z-700,50 60 76) / <alpha-value>)',
  				'800': 'rgb(var(--c-z-800,22 31 45) / <alpha-value>)',
  				'900': 'rgb(var(--c-z-900,17 24 39) / <alpha-value>)',
  				'925': 'rgb(var(--c-z-925,8 12 25) / <alpha-value>)',
  				'950': 'rgb(var(--c-z-950,5 9 16) / <alpha-value>)'
  			},
  			black: 'rgb(var(--c-o-black,0 0 0) / <alpha-value>)',
  			white: 'rgb(var(--c-o-white,255 255 255) / <alpha-value>)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			spinner: {
  				'0%': {
  					opacity: '1'
  				},
  				'100%': {
  					opacity: '0'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			spin: {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			spinner: 'spinner 1.2s linear infinite',
  			spin: 'spin 1s linear infinite',
  			'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
