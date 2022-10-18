import React from 'react';
import modalsMap from '../modals';
import { useModalManagerContext } from './modal-manager-context';

const ModalManager = () => {
    const { active_modal, modal_props } = useModalManagerContext();

    if (active_modal) {
        const LazyModal = React.lazy(() => import(modalsMap[active_modal]));

        return (
            <React.Suspense>
                <LazyModal {...modal_props} />
            </React.Suspense>
        );
    }
    // }
    return null;
};

export default ModalManager;
