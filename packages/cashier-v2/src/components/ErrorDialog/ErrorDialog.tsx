import React, { useEffect, useState } from 'react';
import { Button, Dialog } from '@deriv-com/ui';
import styles from './ErrorDialog.module.scss';

type TErrorDialogProps = {
    isOpen: boolean;
};

const ErrorDialog: React.FC<React.PropsWithChildren<TErrorDialogProps>> = ({ children, isOpen }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

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
                Cashier Error
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
            <Dialog.Footer className={styles.footer}>
                <Button
                    data-testid='dt_error_dialog_ok_button'
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
