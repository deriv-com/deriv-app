import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';

const FinancialStpDescription = ({ is_real_financial_stp }) => (
    <React.Fragment>
        {is_real_financial_stp && (
            <p className='dc-modal__container_mt5-password-modal__description--financial-stp'>
                <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Binary (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).' />
            </p>
        )}
    </React.Fragment>
);

FinancialStpDescription.propTypes = {
    is_real_financial_stp: PropTypes.bool,
};

export default FinancialStpDescription;
