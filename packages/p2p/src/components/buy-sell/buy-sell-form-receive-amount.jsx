import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { Localize } from 'Components/i18next';

const BuySellFormReceiveAmount = ({ is_sell_advert, receive_amount, local_currency }) => (
    <React.Fragment>
        <Text as='p' color='less-prominent' line_height='m' size='xxs'>
            {is_sell_advert ? (
                <Localize i18n_default_text="You'll receive" />
            ) : (
                <Localize i18n_default_text="You'll send" />
            )}
        </Text>
        <Text as='p' color='general' line_height='m' size='xs' weight='bold'>
            {getFormattedText(receive_amount, local_currency)}
        </Text>
    </React.Fragment>
);

BuySellFormReceiveAmount.propTypes = {
    is_sell_advert: PropTypes.bool.isRequired,
    receive_amount: PropTypes.number.isRequired,
    local_currency: PropTypes.string.isRequired,
};

export default BuySellFormReceiveAmount;
