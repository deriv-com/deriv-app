import React from 'react';
import { Icon, Text } from '@deriv/components';
import { TTradeModalHeader } from '../trade-modal-types';

const TradeModalHeader = ({ balance, icon, title, toggleTradeModal }: TTradeModalHeader) => {
    return (
        <div className='dw-trade-modal__header'>
            <div className='dw-trade-modal__header--left'>
                <Text line-height='m'>{title}</Text>
                <Text line-height='m' size='m' weight='bold'>
                    {balance}
                </Text>
            </div>
            <div className='dw-trade-modal__header--right'>
                <Icon className='dw-trade-modal__header--icon-logo' icon={icon} size={40} />
                <Icon className='dw-trade-modal__header--icon-close' icon='IcCross' onClick={toggleTradeModal} />
            </div>
        </div>
    );
};

export default TradeModalHeader;
