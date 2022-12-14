import React from 'react';
import { Text } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { roundOffDecimal } from 'Utils/format-value';
import { useStores } from 'Stores';

const BuySellFormReceiveAmount = () => {
    const { buy_sell_store } = useStores();

    return (
        <div className='buy-sell__modal-receive-amount'>
            <Text as='p' color='less-prominent' line_height='m' size='xxs'>
                {buy_sell_store?.is_sell_advert ? (
                    <Localize i18n_default_text="You'll receive" />
                ) : (
                    <Localize i18n_default_text="You'll send" />
                )}
            </Text>
            <Text as='p' color='general' line_height='m' size='xs' weight='bold'>
                {getFormattedText(
                    roundOffDecimal(buy_sell_store?.receive_amount),
                    buy_sell_store?.advert?.local_currency
                )}
            </Text>
        </div>
    );
};

export default BuySellFormReceiveAmount;
