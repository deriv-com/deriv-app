import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './sass/contract-card-dialog.scss';
import { useOnClickOutside } from '../../../hooks/use-onclickoutside';

export type TContractCardDialogProps = {
    children: React.ReactNode;
    is_visible: boolean;
    left: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggleDialog: (e: any) => void; // This function accomodates events for various HTML elements, which have no overlap, so typing it to any
    toggle_ref?: React.RefObject<HTMLElement>;
    top: number;
};

const ContractCardDialog = React.forwardRef(
    (
        { children, is_visible, left, toggleDialog, toggle_ref, top }: TContractCardDialogProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ) => {
        const validateClickOutside = (event: MouseEvent) =>
            is_visible && !toggle_ref?.current?.contains(event.target as Node);

        useOnClickOutside(ref as React.RefObject<HTMLDivElement>, toggleDialog, validateClickOutside);

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
        const deriv_app_element = document.getElementById('deriv_app');
        return ReactDOM.createPortal(
            dialog, // use portal to render dialog above ThemedScrollbars container
            deriv_app_element || document.body
        );
    }
);

ContractCardDialog.displayName = 'ContractCardDialog';

export default ContractCardDialog;
