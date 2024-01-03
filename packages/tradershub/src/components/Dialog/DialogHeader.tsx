import React from 'react';
import { Provider } from '@deriv/library';
import { Heading, qtMerge } from '@deriv/quill-design';
import CloseIcon from '../../public/images/ic-close-dark.svg';

/**
 * Type for the DialogHeader component props
 * @typedef TDialogHeader
 * @property {string} [className] - Optional CSS class name
 * @property {boolean} [hideCloseButton] - Optional flag to hide the close button
 * @property {string} [title] - Optional title for the dialog header
 */
type TDialogHeader = {
    className?: string;
    hideCloseButton?: boolean;
    title?: string;
};

/**
 * DialogHeader component
 * @param {TDialogHeader} props - The properties that define the DialogHeader component.
 * @returns {JSX.Element} The DialogHeader component.
 */
const DialogHeader = ({ className, hideCloseButton = false, title }: TDialogHeader) => {
    const { hide } = Provider.useModal();

    return (
        <div className={qtMerge('flex items-start', title ? 'justify-between' : 'justify-end', className)}>
            {title && <Heading.H3 className='flex-1'>{title}</Heading.H3>}
            {!hideCloseButton && <CloseIcon className='hover:cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default DialogHeader;
