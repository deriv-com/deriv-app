import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const NewTooltipContainerClassnames = cva(
    'invisible group-hover:visible absolute whitespace-nowrap p-400 text-75 rounded-200 bg-system-light-hover-background text-system-light-general-text',
    {
        defaultVariants: {
            position: 'top',
        },
        variants: {
            position: {
                bottom: 'left-1/2 -translate-x-1/2 top-[calc(100%+5px)]',
                left: 'top-1/2 -translate-y-1/2 right-[calc(100%+5px)]',
                right: 'top-1/2 -translate-y-1/2 left-[calc(100%+5px)]',
                top: 'left-1/2 -translate-x-1/2 bottom-[calc(100%+5px)]',
            },
        },
    }
);

export const NewTooltipClassnames = cva('invisible group-hover:visible absolute border-solid border-300', {
    defaultVariants: {
        position: 'top',
    },
    variants: {
        position: {
            bottom: 'left-1/2 -translate-x-1/2 top-full border-l-random-transparent border-r-random-transparent border-t-50 border-b-system-light-hover-background',
            left: 'top-1/2 -translate-y-1/2 right-full border-t-random-transparent border-b-random-transparent border-r-50 border-l-system-light-hover-background',
            right: 'top-1/2 -translate-y-1/2 left-full border-t-random-transparent border-b-random-transparent border-l-50 border-r-system-light-hover-background',
            top: 'left-1/2 -translate-x-1/2 bottom-full border-l-random-transparent border-r-random-transparent border-b-50 border-t-system-light-hover-background',
        },
    },
});

export type NewTooltipContainerProps = ExcludeAllNull<VariantProps<typeof NewTooltipContainerClassnames>>;
export type NewTooltipClassnamesProps = ExcludeAllNull<VariantProps<typeof NewTooltipClassnames>>;
