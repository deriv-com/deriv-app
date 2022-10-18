import React from 'react';
import { ModalManagerContext } from './modal-manager-context';
import modalsMap from 'Components/modals';
import { makeLazyLoader } from '@deriv/shared';

const ModalManagerContextProvider = props => {
    const [active_modal, setActiveModal] = React.useState(null);
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [modal_props, setModalProps] = React.useState(new Map());

    const showModal = modal_id => {
        setActiveModal(modal_id);
        setIsModalOpen(true);
        console.log('lool');
    };

    const hideModal = () => {
        setActiveModal(null);
        setIsModalOpen(false);
    };

    const passModalProps = (modal_id, modal_props) => {
        setModalProps(modal_props.set(modal_id, modal_props));
    };

    const state = {
        hideModal,
        is_modal_open,
        active_modal,
        modal_props: modal_props,
        showModal,
        passModalProps,
    };

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
