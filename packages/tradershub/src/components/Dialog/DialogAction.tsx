import React, { ReactNode } from 'react';
import { qtMerge } from '@deriv/quill-design';

type TModalContent = {
    children?: ReactNode;
    className?: string;
};

const DialogFooter = ({ children, className }: TModalContent) => (
    <div className={qtMerge('flex gap-400 justify-end', className)}>{children}</div>
);

export default DialogFooter;
