import React, { FC, useEffect } from 'react';
import { Provider } from '@deriv/library';
import { Modal } from '../../../../components/Modal';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { MT5TradeScreen } from '../../screens/MT5TradeScreen';

type TTradeModalProps = {
    account?: THooks.MT5AccountsList;
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
        <Modal>
            <MT5TradeScreen mt5Account={account} />
        </Modal>
        // <Modal>
        //     <Modal.Content className='overflow-y-scroll'>Interesting</Modal.Content>
        // </Modal>
    );
};

export default TradeModal;
