import { cva, VariantProps } from 'class-variance-authority';

export const TooltipClass = cva('z-1 absolute invisible flex flex-col group-hover:visible', {
    variants: {
        alignment: {
            bottom: 'top-1500 right-1',
            left: 'top-1 right-2000',
            right: 'top-1 left-2000',
            top: 'bottom-1500 right-1',
        },
    },
});

export const TooltipPointerClass = cva('absolute transform rotate-45 h-8 w-8 bg-system-light-active-background', {
    variants: {
        alignment: {
            bottom: '-mb-1 bottom-28 right-1/2',
            left: '-mb-1 top-12 -right-200',
            right: '-mb-1 top-12 -left-200',
            top: '-mb-1 top-28 right-1/2',
        },
    },
});

export type TooltipProps = NonNullable<VariantProps<typeof TooltipClass>>;
