import React, { FC, useEffect } from 'react';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { ModalTradeWrapper } from '../../components';

type TCTraderTradeModalProps = {
    marketType?: TMarketTypes.All;
    mt5Account?: THooks.MT5AccountsList;
    platform: TPlatforms.All;
};

const CTraderTradeModal: FC<TCTraderTradeModalProps> = ({ platform }) => {
    const { setModalState } = useModal();
    useEffect(() => {
        setModalState('platform', platform);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ModalTradeWrapper platform={platform}>
            <div>ddd</div>
        </ModalTradeWrapper>
    );
};

export default CTraderTradeModal;
