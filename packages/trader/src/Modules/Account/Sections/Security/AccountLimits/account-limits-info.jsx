import PropTypes         from 'prop-types';
import React             from 'react';
import Icon              from 'Assets/icon.jsx';
import Localize          from 'App/Components/Elements/localize.jsx';

const AccountLimitsInfo = ({
    currency,
    is_virtual,
}) => (
    <>
        {is_virtual ?
            <Localize i18n_default_text='Demo account' />
            :
            <>
                <Icon
                    icon='IconAccountsCurrency'
                    type={currency.toLowerCase()}
                />
                <p className='account__inset_header-subheading'>
                    <Localize
                        i18n_default_text='For your {{currency}} account'
                        values={{ currency: currency.toUpperCase() }}
                    />
                </p>

            </>
        }
    </>
);

AccountLimitsInfo.propTypes = {
    currency  : PropTypes.string,
    is_virtual: PropTypes.bool,
};

export default AccountLimitsInfo;
