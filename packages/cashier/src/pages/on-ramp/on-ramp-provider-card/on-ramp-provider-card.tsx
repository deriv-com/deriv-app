import React from 'react';
import { Button, Icon, NewsTicker, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { TProviderDetails, TRootStore, TUiStore } from 'Types';

type TOnRampProviderCardProps = {
    is_dark_mode_on: TUiStore['is_dark_mode_on'];
    provider: TProviderDetails;
    setSelectedProvider: (provider: TProviderDetails) => void;
    is_mobile: TUiStore['is_mobile'];
};

const OnRampProviderCard = ({
    is_dark_mode_on,
    provider,
    setSelectedProvider,
    is_mobile,
}: TOnRampProviderCardProps) => {
    const payment_icons = provider.getPaymentIcons();
    const gtm_identifier = provider.name.toLowerCase().replace(' ', '-');
    const logo_size = is_mobile ? 56 : 128;

    return (
        <div className='on-ramp__provider'>
            <div className='on-ramp__provider-logo'>
                <Icon
                    data_testid={is_dark_mode_on ? 'dti_provider_icon_dark' : 'dti_provider_icon_light'}
                    icon={is_dark_mode_on ? provider.icon.dark : provider.icon.light}
                    width={logo_size}
                    height={logo_size}
                />
            </div>
            <Text size='s' color='prominent' weight='bold' line_height='l' className='on-ramp__provider-name'>
                {provider.name}
            </Text>
            <Text size='xs' line_height='m' as='p' className='on-ramp__provider-description'>
                {provider.getDescription()}
            </Text>
            <div className='on-ramp__provider-payment-icons'>
                <div className='on-ramp__provider-payment-icons-shadow' />
                <NewsTicker speed={10}>
                    {payment_icons.map((payment_icon, idx) => (
                        <Icon
                            data_testid={is_dark_mode_on ? 'dti_payment_icon_dark' : 'dti_payment_icon_light'}
                            icon={is_dark_mode_on ? payment_icon.dark : payment_icon.light}
                            key={idx}
                            size={40}
                        />
                    ))}
                </NewsTicker>
            </div>
            <Button
                id={`gtm-onramp-provider-select--${gtm_identifier}`}
                className='on-ramp__provider-button'
                type='button'
                has_effect
                onClick={() => setSelectedProvider(provider)}
                text={localize('Select')}
                primary
                small={is_mobile}
            />
        </div>
    );
};

export default connect(({ modules, ui }: TRootStore) => ({
    setSelectedProvider: modules.cashier.onramp.setSelectedProvider,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_mobile: ui.is_mobile,
}))(OnRampProviderCard);
