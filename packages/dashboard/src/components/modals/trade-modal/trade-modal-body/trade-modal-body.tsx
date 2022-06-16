import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStores } from 'Stores';
import { TTradeModalBody } from '../trade-modal-types';

const TradeModalBody: React.FC<TTradeModalBody> = ({ launch_apps, qrcode_data }) => {
    const { config_store } = useStores();
    return (
        <div className='dw-trade-modal__body'>
            <Text as='p' className='dw-trade-modal__body--subtitle' size='xs'>
                {localize('Choose an app to launch')}
            </Text>
            <div className='dw-trade-modal__body--apps'>
                {launch_apps.map((apps, idx) => (
                    <div className='dw-trade-modal__body--apps-item' key={idx} onClick={() => apps.click()}>
                        <Icon icon={apps.icon} size={40} />
                        <Text size='xs'>{apps.app_title}</Text>
                    </div>
                ))}
            </div>
            <div className='dw-trade-modal__mobile'>
                <Text as='span' className='dw-trade-modal__mobile-text' size='xs' weight='bold'>
                    {localize('Mobile')}
                </Text>
            </div>
            <div className='dw-trade-modal__qrcode'>
                <img src={`${config_store.asset_path}/images/${qrcode_data.filename}`} />
                <Text size='xxs'>{qrcode_data.subtitle}</Text>
            </div>
        </div>
    );
};

export default TradeModalBody;
