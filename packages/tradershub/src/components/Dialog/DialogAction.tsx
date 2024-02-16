import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { DialogActionClass, DialogActionProps } from './Dialog.classnames';

/**
 * Interface for the DialogAction component props
 * @interface TDialogActions
 * @extends {DialogActionProps}
 */
export interface TDialogActions extends DialogActionProps {
    children?: ReactNode;
    className?: string;
}

/**
 * DialogAction component
 * @param {TDialogActions} props - The properties that define the DialogAction component.
 * @returns {JSX.Element} The DialogAction component.
 */
const DialogAction = ({ align, children, className }: TDialogActions) => (
    <div className={clsx(DialogActionClass({ align }), className)}>{children}</div>
);

export default DialogAction;
