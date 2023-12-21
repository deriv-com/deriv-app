import React, { ReactNode } from 'react';
import { useEventListener } from 'usehooks-ts';
import { qtMerge } from '@deriv/quill-design';
import { useModal } from '../ModalProvider';
import DialogAction from './DialogAction';
import ModalContent from './DialogContent';
import DialogHeader from './DialogHeader';

type TDialog = {
    children: ReactNode;
    className?: string;
    shouldPreventCloseOnEscape?: boolean;
};

const Dialog = ({ children, className, shouldPreventCloseOnEscape = false }: TDialog) => {
    const { hide } = useModal();

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    return (
        <div
            className={qtMerge(
                'flex flex-col gap-1200 mx-auto w-[328px] lg:w-[440px] p-1200 bg-background-primary-base rounded-400',
                className
            )}
        >
            {children}
        </div>
    );
};

Dialog.Header = DialogHeader;
Dialog.Body = ModalContent;
Dialog.Action = DialogAction;

export default Dialog;
