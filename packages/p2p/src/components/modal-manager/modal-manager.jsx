import React from 'react';
import { modals } from 'Constants/modals';
import { useModalManagerContext } from './modal-manager-context';

const ModalManager = () => {
    const { modal, stacked_modal } = useModalManagerContext();

    const { key, props } = modal;
    const Modal = modals[key];
    const StackedModal = modals[stacked_modal?.key];
    if (Modal)
        return (
            <React.Suspense fallback={null}>
                <Modal {...props} />
                {StackedModal && (
                    <React.Suspense fallback={null}>
                        <StackedModal {...stacked_modal.props} />
                    </React.Suspense>
                )}
            </React.Suspense>
        );

    return null;
};

export default ModalManager;
