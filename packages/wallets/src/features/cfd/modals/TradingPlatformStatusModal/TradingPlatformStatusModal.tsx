import React from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { DISABLED_PLATFORM_STATUSES } from '../../constants';
import { TradingPlatformStatus } from '../../screens';

type TradingPlatformStatusModalProps = {
    status: typeof DISABLED_PLATFORM_STATUSES[number];
};

const TradingPlatformStatusModal: React.FC<TradingPlatformStatusModalProps> = ({ status }) => (
    <ModalWrapper>
        <TradingPlatformStatus status={status} />
    </ModalWrapper>
);

export default TradingPlatformStatusModal;
