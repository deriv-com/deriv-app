import { cva, VariantProps } from 'class-variance-authority';

export const TooltipClass = cva('z-10 absolute invisible flex flex-col peer-hover:visible', {
    variants: {
        alignment: {
            bottom: 'top-full right-0',
            left: 'right-full top-1/2 transform -translate-y-1/2',
            right: 'left-full top-1/2 transform -translate-y-1/2',
            top: 'bottom-full transform -translate-x-1/2',
        },
    },
});

export const TooltipPointerClass = cva('absolute transform rotate-45 h-8 w-8 bg-system-light-active-background', {
    variants: {
        alignment: {
            bottom: '-top-2 right-1/4 transform -translate-x-1/2',
            left: 'top-1/2 -right-2 transform -translate-y-1/2',
            right: 'top-1/2 -left-2 transform -translate-y-1/2',
            top: '-bottom-2 right-1/4 transform -translate-x-1/2',
        },
    },
});

export type TooltipProps = NonNullable<VariantProps<typeof TooltipClass>>;
