import React, { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull, qtMerge } from '@deriv/quill-design';

type TModalFooterClass = ExcludeAllNull<VariantProps<typeof ModalFooterClass>>;

interface TModalFooter extends TModalFooterClass {
    children: ReactNode;
    className?: string;
}

const ModalFooter = ({ align = 'right', children, className }: TModalFooter) => (
    <div className={qtMerge(ModalFooterClass({ align }), className)}>{children}</div>
);

export default ModalFooter;

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
