import React from 'react';
import { Button, Tooltip } from '@deriv-com/ui';
import AlertIcon from '../../../../public/ic-alert-warning.svg';
import './AlertComponent.scss';

type TProps = {
    setIsModalOpen: (value: boolean) => void;
};

const AlertComponent = ({ setIsModalOpen }: TProps) => (
    <div className='p2p-v2-alert-component'>
        <Button onClick={() => setIsModalOpen(true)}>
            <Tooltip message='Ad not listed' position='bottom'>
                <AlertIcon data-testid='dt_p2p_v2_alert_icon' />
            </Tooltip>
        </Button>
    </div>
);

export default AlertComponent;
