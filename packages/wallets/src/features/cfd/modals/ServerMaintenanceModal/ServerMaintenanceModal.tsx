import React, { FC } from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { TPlatforms } from '../../../../types';
import { AccountUnavailable, ServerMaintenance } from '../../screens';

type TServerMaintenanceModalProps = {
    platform: TPlatforms.All;
};

const ServerMaintenanceModal: FC<TServerMaintenanceModalProps> = ({ platform }) => (
    <ModalWrapper>{platform ? <ServerMaintenance platform={platform} /> : <AccountUnavailable />}</ModalWrapper>
);

export default ServerMaintenanceModal;
