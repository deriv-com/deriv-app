import React from 'react';
import { Heading, qtMerge } from '@deriv/quill-design';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';
import { TModalComponents } from './Modal';

/**
 * Type for the ModalHeader component props
 * @typedef TModalHeader
 * @property {string} [className] - Optional CSS class name
 * @property {boolean} [hideCloseButton] - Optional flag to hide the close button
 * @property {string} [title] - Optional title for the header
 * @extends TModalComponents
 */
type TModalHeader = TModalComponents & { hideCloseButton?: boolean; title?: string };

/**
 * ModalHeader component
 * @param {TModalHeader} props - The properties that define the ModalHeader component.
 * @returns {JSX.Element} The ModalHeader component.
 */
const ModalHeader = ({ className, hideCloseButton = false, title }: TModalHeader) => {
    const { hide } = useModal();

    return (
        <div
            className={qtMerge(
                'flex items-center pl-800 pr-1200 py-800 lg:px-1200 border border-solid border-b-100 border-system-light-secondary-background w-full',
                title ? 'justify-between' : 'justify-end',
                className
            )}
        >
            {title && <Heading.H3 className='flex-1'>{title}</Heading.H3>}
            {!hideCloseButton && <CloseIcon className='cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default ModalHeader;
