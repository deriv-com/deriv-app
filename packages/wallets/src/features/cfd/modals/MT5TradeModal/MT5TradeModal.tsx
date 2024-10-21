import React, { FC, useEffect } from 'react';
import { useModal } from '../../../../components/ModalProvider';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { ModalTradeWrapper } from '../../components';
import { MT5TradeScreen } from '../../screens';
import { TAddedMT5Account } from '../../types';

type TMT5TradeModalProps = {
    marketType?: TMarketTypes.All;
    mt5Account?: TAddedMT5Account;
    platform: TPlatforms.All;
};

const MT5TradeModal: FC<TMT5TradeModalProps> = ({ marketType, mt5Account, platform }) => {
    const { setModalState } = useModal();
    useEffect(() => {
        setModalState('marketType', marketType);
        setModalState('platform', platform);
        setModalState('accountId', mt5Account?.loginid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ModalTradeWrapper platform={platform}>
            <MT5TradeScreen mt5Account={mt5Account} />
        </ModalTradeWrapper>
    );
};

export default MT5TradeModal;
