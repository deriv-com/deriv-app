import React from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { TradingPlatformStatus } from '../../screens';

type TradingPlatformStatusModalProps = {
    isServerMaintenance?: boolean;
};

const TradingPlatformStatusModal: React.FC<TradingPlatformStatusModalProps> = ({ isServerMaintenance = false }) => (
    <ModalWrapper>
        <TradingPlatformStatus isServerMaintenance={isServerMaintenance} />
    </ModalWrapper>
);

export default TradingPlatformStatusModal;
