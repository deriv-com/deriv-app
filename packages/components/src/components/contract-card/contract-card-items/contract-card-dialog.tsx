import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './sass/contract-card-dialog.scss';
import { useOnClickOutside } from '../../../hooks/use-onclickoutside';

type ContractCardDialogProps = {
    children: React.ReactNode;
    is_visible: boolean;
    left: number;
    toggle_ref: unknown;
    toggleDialog: () => void;
    top: number;
};

const ContractCardDialog = React.forwardRef(
    ({ children, is_visible, left, toggleDialog, toggle_ref, top }: ContractCardDialogProps, ref) => {
        const validateClickOutside = event => is_visible && !toggle_ref.current.contains(event.target);

        useOnClickOutside(ref, toggleDialog, validateClickOutside);

        const dialog = (
            <CSSTransition
                in={is_visible}
                classNames={{
                    enter: 'dc-contract-card-dialog--enter',
                    enterDone: 'dc-contract-card-dialog--enter-done',
                    exit: 'dc-contract-card-dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <div
                    ref={ref}
                    className='dc-contract-card-dialog'
                    style={{
                        top,
                        left: `calc(${left}px + 32px)`,
                    }}
                >
                    {children}
                </div>
            </CSSTransition>
        );

        return ReactDOM.createPortal(
            dialog, // use portal to render dialog above ThemedScrollbars container
            document.getElementById('deriv_app')
        );
    }
);

ContractCardDialog.displayName = 'ContractCardDialog';

export default ContractCardDialog;
