import React from 'react';
import { modals } from 'Constants/modals';
import { useModalManagerContext } from './modal-manager-context';

const ModalManager = () => {
    const { modal, modal_props, stacked_modal } = useModalManagerContext();

    const { key } = modal;
    const Modal = modals[key];
    const StackedModal = modals[stacked_modal?.key];

    const getModalProps = current_modal => {
        if (current_modal?.props && Object.keys(current_modal.props).length > 0) {
            // if props was provided to the argument and it was also already initialised using useRegisterModalProps,
            // merge the 2 props together and update latest prop values with the passed prop argument
            if (modal_props.has(current_modal.key)) {
                return {
                    ...modal_props.get(current_modal.key),
                    ...current_modal.props,
                };
            }
            return current_modal.props;
        }
        if (modal_props.has(current_modal.key)) {
            return modal_props.get(current_modal.key);
        }
        return {};
    };

    if (Modal)
        return (
            <React.Suspense fallback={null}>
                <Modal {...getModalProps(modal)} />
                {StackedModal && (
                    <React.Suspense fallback={null}>
                        <StackedModal {...getModalProps(stacked_modal)} />
                    </React.Suspense>
                )}
            </React.Suspense>
        );

    return null;
};

export default ModalManager;
