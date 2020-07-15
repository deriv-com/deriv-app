import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const FundsProtection = ({ submitFundsProtection }) => {
    return (
        <div className='funds-protectiosn'>
            <Icon icon='IcMoneyTransfer' className='funds-protection__icon' />
            <h2 className='funds-protection__title'>{localize('Funds protection level')}</h2>
            <p className='funds-protection__desc'>
                {
                    <Localize i18n_default_text="We hold customer funds in bank accounts separate from our operational accounts which would not, in the event of insolvency, form part of the company's assets. This meets the <0>Gambling Commission</0>'s requirements for the segregation of customer funds at the level: <1>medium protection</1>" />
                }
            </p>
            <Button primary large onClick={submitFundsProtection}>
                {localize('Deposit now')}
            </Button>
        </div>
    );
};

FundsProtection.propTypes = {
    submitFundsProtection: PropTypes.func,
};

export default connect(({ client }) => ({
    submitFundsProtection: client.submitFundsProtection,
}))(FundsProtection);
