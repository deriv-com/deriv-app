import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const OnRampProviderCard = ({ provider, setSelectedProvider }) => (
    <div className='on-ramp__provider'>
        <div className='on-ramp__provider-logo'>
            <Icon icon={provider.icon} width={118} height={28} />
        </div>
        <h2 className='on-ramp__provider-name'>{provider.name}</h2>
        <div className='on-ramp__provider-description'>{provider.description}</div>
        <a href={provider.website} className='on-ramp__provider-website link' target='_blank' rel='noopener noreferrer'>
            {provider.website}
        </a>
        {provider.payment_icons.length && (
            <div className='on-ramp__provider-payment-icons'>
                {provider.payment_icons.map((payment_icon, idx) => (
                    <Icon key={idx} size={40} icon={payment_icon} />
                ))}
            </div>
        )}
        <Button
            id={`gtm-onramp-provider-select--${provider.name.toLowerCase().replace(' ', '-')}`}
            className='on-ramp__provider-button'
            type='button'
            has_effect
            onClick={() => setSelectedProvider(provider)}
            text={localize('Select')}
            primary
        />
    </div>
);

OnRampProviderCard.propTypes = {
    provider: PropTypes.object,
    setSelectedProvider: PropTypes.func,
};

export default connect(({ modules }) => ({
    setSelectedProvider: modules.cashier.onramp.setSelectedProvider,
}))(OnRampProviderCard);
