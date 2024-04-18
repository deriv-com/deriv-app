import { cva } from 'class-variance-authority';

export const accordionTransitionStyle = 'transition-all duration-[0.4s] ease-[cubic-bezier(0.72,_0,_0.24,_1)]';

export const accordionContentBaseStyle = 'grid overflow-hidden transition-all duration-300 ease-in-out';

export const accordionVariant = cva(accordionContentBaseStyle, {
    variants: {
        expanded: {
            true: 'grid-rows-[1fr]',
            false: 'grid-rows-[0fr]',
        },
    },
    defaultVariants: {
        expanded: false,
    },
});
