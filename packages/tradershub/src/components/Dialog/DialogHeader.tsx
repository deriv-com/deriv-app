import React from 'react';
import { Heading, qtMerge } from '@deriv/quill-design';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';

type TDialogHeader = {
    className?: string;
    hideCloseButton?: boolean;
    title?: string;
};

const DialogHeader = ({ className, hideCloseButton = false, title }: TDialogHeader) => {
    const { hide } = useModal();

    return (
        <div className={qtMerge('flex items-start', title ? 'justify-between' : 'justify-end', className)}>
            {title && <Heading.H3 className='flex-1'>{title}</Heading.H3>}
            {!hideCloseButton && <CloseIcon className='hover:cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default DialogHeader;
