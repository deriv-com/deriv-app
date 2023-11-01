import React, { FC, useEffect } from 'react';
import { useModal } from '../../../../components/ModalProvider';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { ModalTradeWrapper } from '../../components';
import { MT5TradeScreen } from '../../screens';

type TMT5TradeModal = {
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const MT5TradeModal: FC<TMT5TradeModal> = ({ marketType, platform }) => {
    const { setModalState } = useModal();
    useEffect(() => {
        setModalState('marketType', marketType);
        setModalState('platform', platform);
    }, [marketType, platform]);

    return (
        <ModalTradeWrapper marketType={marketType} platform={platform}>
            <MT5TradeScreen />
        </ModalTradeWrapper>
    );
};

export default MT5TradeModal;
