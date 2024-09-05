import React, { isValidElement, PropsWithChildren } from 'react';
import { Button, Dialog, Text } from '@deriv-com/ui';
import './WalletDialog.scss';

type TWalletDialogProps = {
    cancelButtonText?: JSX.Element | string;
    confirmButtonText?: JSX.Element | string;
    hideCloseIcon?: boolean;
    isVisible: boolean;
    onCancel?: VoidFunction;
    onClose: VoidFunction;
    onConfirm?: VoidFunction;
    shouldCloseOnOverlayClick?: boolean;
    title?: JSX.Element | string;
};

const WalletDialog: React.FC<PropsWithChildren<TWalletDialogProps>> = ({
    cancelButtonText,
    children,
    confirmButtonText,
    hideCloseIcon = false,
    isVisible = false,
    onCancel,
    onClose,
    onConfirm,
    shouldCloseOnOverlayClick = false,
    title,
}) => {
    const isText =
        typeof children === 'string' ||
        (isValidElement(children) && typeof children?.props?.i18n_default_text === 'string');

    const onConfirmHandler = () => {
        onConfirm?.();
        onClose();
    };

    const onCancelHandler = () => {
        onCancel?.();
        onClose();
    };

    return (
        <Dialog
            className='wallets-dialog'
            isOpen={isVisible}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        >
            {title && (
                <Dialog.Header
                    className='wallets-dialog__header'
                    hideCloseIcon={hideCloseIcon}
                    onRequestClose={onClose}
                >
                    <Text weight='bold'>{title}</Text>
                </Dialog.Header>
            )}
            {children && (
                <Dialog.Body className='wallets-dialog__body'>
                    {isText ? <Text size='sm'>{children}</Text> : children}
                </Dialog.Body>
            )}
            <Dialog.Footer className='wallets-dialog__footer'>
                {cancelButtonText && (
                    <Button
                        color='black'
                        onClick={onCancelHandler}
                        size='lg'
                        textSize='sm'
                        type='button'
                        variant='outlined'
                    >
                        {cancelButtonText}
                    </Button>
                )}
                {confirmButtonText && (
                    <Button onClick={onConfirmHandler} size='lg' textSize='sm' type='button'>
                        {confirmButtonText}
                    </Button>
                )}
            </Dialog.Footer>
        </Dialog>
    );
};

export default WalletDialog;
