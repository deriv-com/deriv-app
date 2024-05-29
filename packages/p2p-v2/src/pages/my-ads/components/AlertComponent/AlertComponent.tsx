import React from 'react';
import { Button, Tooltip } from '@deriv-com/ui';
import AlertIcon from '../../../../public/ic-alert-warning.svg';
import './AlertComponent.scss';

type TAlertComponentProps = {
    onClick: () => void;
};

const AlertComponent = ({ onClick }: TAlertComponentProps) => (
    <div className='p2p-v2-alert-component'>
        <Tooltip message='Ad not listed' position='bottom'>
            <Button className='p-0 hover:bg-none' color='white' onClick={onClick} variant='outlined'>
                <AlertIcon data-testid='dt_p2p_v2_alert_icon' />
            </Button>
        </Tooltip>
    </div>
);

export default AlertComponent;
