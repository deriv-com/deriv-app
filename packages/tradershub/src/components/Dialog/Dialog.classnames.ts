import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const DialogActionClass = cva(['flex', 'gap-400', 'items-center'], {
    variants: {
        align: {
            center: 'justify-center',
            left: 'justify-start',
            right: 'justify-end',
        },
    },
});

export type DialogActionProps = ExcludeAllNull<VariantProps<typeof DialogActionClass>>;
