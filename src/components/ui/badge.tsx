import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-white text-black',
                secondary: 'bg-neutral-800 text-white border border-neutral-700',
                outline: 'border border-white/30 bg-transparent text-white',
                success: 'bg-green-500 text-black',
                warning: 'bg-yellow-400 text-black',
                destructive: 'bg-red-500 text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
