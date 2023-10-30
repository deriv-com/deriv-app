import React, { FC, useEffect } from 'react';
import { ModalTradeWrapper } from '../../components';
import { MT5TradeScreen } from '../../screens';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { useModal } from '../../../../components/ModalProvider';

type TMT5TradeModal = {
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const MT5TradeModal: FC<TMT5TradeModal> = ({ marketType, platform }) => {
    const { setModalState } = useModal();
    useEffect(() => {
        setModalState('marketType', marketType);
        setModalState('platform', platform);
    }, []);

    return (
        <ModalTradeWrapper marketType={marketType} platform={platform}>
            <MT5TradeScreen />
        </ModalTradeWrapper>
    );
};

export default MT5TradeModal;
