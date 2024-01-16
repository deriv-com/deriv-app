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
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    hideCloseButton?: boolean;
    title?: string;
};

/**
 * DialogHeader component
 * @param {TDialogHeader} props - The properties that define the DialogHeader component.
 * @returns {JSX.Element} The DialogHeader component.
 */
const DialogHeader = ({ className, heading = 'h3', hideCloseButton = false, title }: TDialogHeader) => {
    const headingSizes = {
        h1: Heading.H1,
        h2: Heading.H2,
        h3: Heading.H3,
        h4: Heading.H4,
        h5: Heading.H5,
        h6: Heading.H6,
    };

    const HeadingSize = headingSizes[heading];

    const { hide } = Provider.useModal();

    return (
        <div className={qtMerge('flex items-start', title ? 'justify-between' : 'justify-end', className)}>
            {title && <HeadingSize className='flex-1'>{title}</HeadingSize>}
            {!hideCloseButton && <CloseIcon className='hover:cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default DialogHeader;
