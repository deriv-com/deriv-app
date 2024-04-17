import { cva } from 'class-variance-authority';

export const accordionTransitionStyle = 'transition-all duration-[160ms] ease-[cubic-bezier(0.72,_0,_0.24,_1)]';

// const accordionBaseStyle = 'border border-solid-grey-1 rounded-default p-4';

export const accordionVariant = cva('', {
    variants: {
        expanded: {
            true: 'h-fit',
            false: 'max-h-0 overflow-hidden',
        },
    },
    defaultVariants: {
        expanded: false,
    },
});
