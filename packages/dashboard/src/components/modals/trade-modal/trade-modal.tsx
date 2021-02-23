import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from '@deriv/components';
import { useStores } from 'Stores';
import TradeModalHeader from './trade-modal-header';
import TradeModalBody from './trade-modal-body';
import { TTradeModal } from './trade-modal-types';

const TradeModal: React.FC<TTradeModal> = ({ balance, icon, launch_apps, qrcode_data, title }) => {
    const { ui_store } = useStores();
    const { is_trade_modal_open, toggleTradeModal } = ui_store;

    const closeModal = () => {
        toggleTradeModal();
    };

    return (
        <Modal
            has_close_icon={false}
            height='422px'
            is_open={is_trade_modal_open}
            toggleModal={closeModal}
            width='424px'
        >
            <TradeModalHeader balance={balance} icon={icon} title={title} toggleTradeModal={closeModal} />
            <TradeModalBody launch_apps={launch_apps} qrcode_data={qrcode_data} />
        </Modal>
    );
};

export default observer(TradeModal);
