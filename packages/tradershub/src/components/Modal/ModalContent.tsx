import React, { ReactNode } from 'react';
import { qtMerge } from '@deriv/quill-design';

type TModalContent = {
    children: ReactNode;
    className?: string;
};

const ModalContent = ({ children, className }: TModalContent) => (
    <div className={qtMerge('flex-grow p-400 lg:flex-none', className)}>{children}</div>
);

export default ModalContent;
