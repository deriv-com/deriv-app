import React, { FC, useEffect } from 'react';
import { useModal } from '../../../../components/ModalProvider';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { ModalTradeWrapper } from '../../components';
import { MT5TradeScreen } from '../../screens';

type TMT5TradeModalProps = {
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const MT5TradeModal: FC<TMT5TradeModalProps> = ({ marketType, platform }) => {
    const { setModalState } = useModal();
    useEffect(() => {
        setModalState('marketType', marketType);
        setModalState('platform', platform);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ModalTradeWrapper platform={platform}>
            <MT5TradeScreen />
        </ModalTradeWrapper>
    );
};

export default MT5TradeModal;
