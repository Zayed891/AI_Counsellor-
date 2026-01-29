import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-white text-black hover:bg-gray-100',
                destructive: 'bg-red-500 text-white hover:bg-red-600',
                outline: 'border border-white/20 bg-transparent text-white hover:bg-white/10',
                secondary: 'bg-neutral-800 text-white hover:bg-neutral-700',
                ghost: 'hover:bg-white/10 text-white',
                link: 'text-white underline-offset-4 hover:underline',
                // Remoter-style buttons - main styles
                sharp: 'bg-white text-black hover:bg-gray-100',
                'sharp-outline': 'border border-white/30 bg-transparent text-white hover:bg-white/10',
                'sharp-dark': 'bg-black text-white border border-white/20 hover:bg-neutral-900',
                accent: 'bg-white text-black hover:bg-gray-100',
            },
            size: {
                default: 'h-10 px-6 py-2 text-sm',
                sm: 'h-8 px-4 text-xs',
                lg: 'h-12 px-8 text-sm',
                xl: 'h-14 px-10 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
