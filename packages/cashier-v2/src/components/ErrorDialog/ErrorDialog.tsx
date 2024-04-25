import React, { useEffect, useState } from 'react';
import { Button, Dialog } from '@deriv-com/ui';
import styles from './ErrorDialog.module.scss';

type TErrorDialogProps = {
    header?: React.ReactNode;
    isOpen: boolean;
};

const ErrorDialog: React.FC<React.PropsWithChildren<TErrorDialogProps>> = ({ children, header, isOpen }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    return (
        <Dialog className={styles.container} isOpen={isDialogOpen} shouldCloseOnOverlayClick>
            <Dialog.Header
                className={styles.header}
                hideCloseIcon={false}
                onRequestClose={() => {
                    setIsDialogOpen(false);
                }}
            >
                {header ?? `Cashier Error`}
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
            <Dialog.Footer className={styles.footer}>
                <Button
                    onClick={() => {
                        setIsDialogOpen(false);
                    }}
                    size='lg'
                    textSize='sm'
                >
                    OK
                </Button>
            </Dialog.Footer>
        </Dialog>
    );
};

export default ErrorDialog;
