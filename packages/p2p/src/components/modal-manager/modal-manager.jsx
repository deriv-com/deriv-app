import React from 'react';
import { modals } from 'Constants/modals';
import { useModalManagerContext } from './modal-manager-context';

const ModalManager = () => {
    const { modal } = useModalManagerContext();
    const { key, props } = modal;
    const Modal = modals[key];

    if (Modal)
        return (
            <React.Suspense fallback={null}>
                <Modal {...props} />
            </React.Suspense>
        );

    return null;
};

export default ModalManager;
