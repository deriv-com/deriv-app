import React, { PropsWithChildren, useEffect } from 'react';
import useDevice from '../../../hooks/useDevice';
import { useModal } from '../../ModalProvider';

/**
 * @description This wrapper component handles modals that show a popup with a backdrop on mobile instead of a fullscreen modal.
 */
const ModalWithBackdropWrapper = ({ children }: PropsWithChildren) => {
    const { modalRootRef } = useModal();
    const { isDesktop } = useDevice();
    useEffect(() => {
        if (isDesktop) return; // Desktop modals have this class ('modal-root') by default, mobile modals don't, because they are usually full screen
        const modalRef = modalRootRef;
        modalRef.current?.classList.add('modal-root');
        return () => {
            modalRef.current?.classList.remove('modal-root');
        };
    }, [isDesktop, modalRootRef]);
    return <>{children}</>;
};

export default ModalWithBackdropWrapper;
