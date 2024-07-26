import React, { FC } from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { TPlatforms } from '../../../../types';
import { ServerMaintenance } from '../../screens';

type TServerMaintenanceModalProps = {
    platform: TPlatforms.All;
};

const ServerMaintenanceModal: FC<TServerMaintenanceModalProps> = ({ platform }) => (
    <ModalWrapper>
        <ServerMaintenance platform={platform} />
    </ModalWrapper>
);

export default ServerMaintenanceModal;
