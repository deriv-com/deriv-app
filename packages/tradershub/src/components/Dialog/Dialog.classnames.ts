import { cva, VariantProps } from 'class-variance-authority';

export const DialogActionClass = cva(['flex', 'gap-8', 'items-center'], {
    variants: {
        align: {
            center: 'justify-center',
            left: 'justify-start',
            right: 'justify-end',
        },
    },
});

export type DialogActionProps = NonNullable<VariantProps<typeof DialogActionClass>>;
