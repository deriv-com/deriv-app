import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const OnRampProviderCard = ({ provider, setSelectedProvider }) => {
    return (
        <div className='on-ramp__provider'>
            <div className='on-ramp__provider-logo'>
                <Icon icon={provider.icon} width={118} height={28} />
            </div>
            <h2 className='on-ramp__provider-name'>{provider.name}</h2>
            <div className='on-ramp__provider-description'>{provider.description}</div>
            <a href={provider.website} className='on-ramp__provider-website link'>
                {provider.website}
            </a>
            {provider.payment_types.length && (
                <div className='on-ramp__provider-payment-types'>
                    {provider.payment_types.map((payment_type, idx) => (
                        <Icon key={idx} size={40} icon={payment_type} />
                    ))}
                </div>
            )}
            <Button
                className='on-ramp__provider-button'
                type='button'
                has_effect
                onClick={() => setSelectedProvider(provider)}
                text={localize('Select')}
                primary
            />
        </div>
    );
};

export default connect(({ modules }) => ({
    setSelectedProvider: modules.cashier.config.onramp.setSelectedProvider,
}))(OnRampProviderCard);
