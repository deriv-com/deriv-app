import React, { ReactNode } from 'react';

/**
 * Type for the DialogContent component props
 * @typedef TDialogContent
 * @property {ReactNode} [children] - Optional children nodes
 * @property {string} [className] - Optional CSS class name
 */
type TDialogContent = {
    children?: ReactNode;
    className?: string;
};

/**
 * DialogContent component
 * @param {TDialogContent} props - The properties that define the DialogContent component.
 * @returns {JSX.Element} The DialogContent component.
 */
const DialogContent = ({ children, className }: TDialogContent) => <div className={className}>{children}</div>;

export default DialogContent;
