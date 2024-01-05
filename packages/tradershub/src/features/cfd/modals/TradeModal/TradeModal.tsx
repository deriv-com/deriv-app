import React, { FC, useEffect } from 'react';
import { Provider } from '@deriv/library';
import { Modal } from '../../../../components/Modal';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';

type TTradeModalProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const TradeModal: FC<TTradeModalProps> = ({ account, marketType, platform }) => {
    const { setModalState } = Provider.useModal();
    useEffect(() => {
        setModalState('marketType', marketType);
        setModalState('platform', platform);
        setModalState('accountId', account?.login);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // <ModalTradeWrapper platform={platform}>
        //     <TradeScreen mt5Account={mt5Account} />
        // </ModalTradeWrapper>
        <Modal>
            <Modal.Content className='overflow-y-scroll'>Interesting</Modal.Content>
        </Modal>
    );
};

export default TradeModal;
