import PropTypes    from 'prop-types';
import React        from 'react';
import { Localize } from '@deriv/translations';

const AdvancedDescription = ({ is_real_advanced }) => (
    <React.Fragment>
        {is_real_advanced && (
            <p className='dc-modal__container_mt5-password-modal__description--advanced'>
                <Localize
                    i18n_default_text='Your MT5 advanced account will be opened through Binary (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).'
                />
            </p>
        )}
    </React.Fragment>
);

AdvancedDescription.propTypes = {
    is_real_advanced: PropTypes.bool,
};

export default AdvancedDescription;
