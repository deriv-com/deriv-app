import React from 'react';
import { Heading, qtMerge } from '@deriv/quill-design';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';

type TModalHeader = {
    className?: string;
    hideCloseButton?: boolean;
    title?: string;
};

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
            {!hideCloseButton && <CloseIcon className='hover:cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default ModalHeader;
