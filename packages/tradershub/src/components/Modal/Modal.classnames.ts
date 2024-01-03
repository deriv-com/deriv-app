import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const ModalFooterClass = cva(
    'grid grid-cols-2 gap-400 p-800 border border-solid border-t-100 border-system-light-secondary-background bottom-0 lg:flex lg:items-center lg:px-1200 lg:py-800',
    {
        variants: {
            align: {
                center: 'lg:justify-center',
                left: 'lg:justify-start',
                right: 'lg:justify-end',
            },
        },
    }
);

export type TModalFooterClass = ExcludeAllNull<VariantProps<typeof ModalFooterClass>>;
