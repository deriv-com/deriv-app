import React, { ReactNode } from 'react';

type TDialogContent = {
    children?: ReactNode;
    className?: string;
};

const DialogContent = ({ children, className }: TDialogContent) => <div className={className}>{children}</div>;

export default DialogContent;
