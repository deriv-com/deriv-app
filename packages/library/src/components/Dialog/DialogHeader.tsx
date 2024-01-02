import React from 'react';
import { Heading, qtMerge } from '@deriv/quill-design';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { useModal } from '../../providers';

/**
 * Type for the DialogHeader component props
 * @typedef TDialogHeader
 * @property {string} [className] - Optional CSS class name
 * @property {boolean} [hideCloseButton] - Optional flag to hide the close button
 * @property {string} [title] - Optional title for the dialog header
 */
type TDialogHeader = {
    className?: string;
    hideCloseIcon?: boolean;
    title?: string;
};

/**
 * DialogHeader component
 * @param {TDialogHeader} props - The properties that define the DialogHeader component.
 * @returns {JSX.Element} The DialogHeader component.
 */
const DialogHeader = ({ className, hideCloseIcon = false, title }: TDialogHeader) => {
    const { hide } = useModal();

    return (
        <div className={qtMerge('flex items-start', title ? 'justify-between' : 'justify-end', className)}>
            {title && <Heading.H3 className='flex-1'>{title}</Heading.H3>}
            {!hideCloseIcon && <StandaloneXmarkBoldIcon className='hover:cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default DialogHeader;
