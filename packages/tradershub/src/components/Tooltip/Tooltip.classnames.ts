import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const TooltipClass = cva('z-1 absolute invisible flex flex-col group-hover:visible', {
    variants: {
        alignment: {
            bottom: 'top-1500 right-75',
            left: 'top-75 right-2000',
            right: 'top-75 left-2000',
            top: 'bottom-1500 right-75',
        },
    },
});

export const TooltipPointerClass = cva('absolute transform rotate-45 h-400 w-400 bg-system-light-active-background', {
    variants: {
        alignment: {
            bottom: '-mb-75 bottom-1400 right-1/2',
            left: '-mb-75 top-600 -right-200',
            right: '-mb-75 top-600 -left-200',
            top: '-mb-75 top-1400 right-1/2',
        },
    },
});

export type TooltipProps = ExcludeAllNull<VariantProps<typeof TooltipClass>>;
