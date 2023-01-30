import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './sass/contract-card-dialog.scss';
import { IClickEvent, useOnClickOutside } from '../../../hooks/use-onclickoutside';

export type TContractCardDialogProps = {
    children: React.ReactNode;
    is_visible: boolean;
    left: number;
    toggleDialog: (e: any) => void; // TODO: Update this when I figure out what type accomodates events for various HTML elements
    toggle_ref?: React.RefObject<HTMLDivElement>;
    top: number;
};

const ContractCardDialog = React.forwardRef<HTMLDivElement, TContractCardDialogProps>(
    ({ children, is_visible, left, toggleDialog, toggle_ref, top }, ref) => {
        const validateClickOutside = (event: IClickEvent) =>
            is_visible && !toggle_ref?.current?.contains(event.target as Node);

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
            document.getElementById('deriv_app')!
        );
    }
);

ContractCardDialog.displayName = 'ContractCardDialog';

export default ContractCardDialog;
