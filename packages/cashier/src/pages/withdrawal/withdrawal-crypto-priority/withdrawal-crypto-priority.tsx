import { useCryptoEstimations } from '@deriv/api';
import { Checkbox, Popover, Text } from '@deriv/components';
import { getDecimalPlaces } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useCashierStore } from 'Stores/useCashierStores';
import React from 'react';

import './withdrawal-crypto-priority.scss';

const WithdrawalCryptoPriority = observer(() => {
    const { crypto_fiat_converter, withdraw } = useCashierStore();
    const { client } = useStore();
    const { currency } = client;
    const { converter_from_amount } = crypto_fiat_converter;

    const { error, setCryptoEstimationsFeeUniqueId, setCryptoEstimationsFee } = withdraw;
    const {
        getCryptoEstimations,
        error: crypto_estimation_error,
        crypto_estimations_fee,
        crypto_estimations_fee_unique_id,
        count_down,
        server_time,
        setCurrencyCode,
        unsubscribeCryptoEstimations,
    } = useCryptoEstimations();
    const [priority_withdrawal_checkbox, setPriorityWithdrawalCheckbox] = React.useState(false);
    const decimal_places = getDecimalPlaces(currency);

    React.useEffect(() => {
        if (crypto_estimation_error) {
            error.setErrorMessage({ code: crypto_estimation_error.code, message: crypto_estimation_error.message });
            setPriorityWithdrawalCheckbox(!priority_withdrawal_checkbox);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crypto_estimation_error]);

    React.useEffect(() => {
        if (!priority_withdrawal_checkbox) {
            setCryptoEstimationsFeeUniqueId('');
            setCryptoEstimationsFee(0);
        } else if (crypto_estimations_fee_unique_id) {
            setCryptoEstimationsFeeUniqueId(crypto_estimations_fee_unique_id);
            setCryptoEstimationsFee(crypto_estimations_fee);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priority_withdrawal_checkbox, crypto_estimations_fee_unique_id, setCryptoEstimationsFeeUniqueId]);

    React.useEffect(() => {
        return () => {
            unsubscribeCryptoEstimations();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className='withdrawal-crypto-priority__checkbox-div'>
                <Checkbox
                    name='priority_withdrawal'
                    onChange={() => {
                        if (!priority_withdrawal_checkbox) {
                            setCurrencyCode(currency);
                            getCryptoEstimations({
                                payload: {
                                    currency_code: currency,
                                },
                            });
                        }
                        setPriorityWithdrawalCheckbox(!priority_withdrawal_checkbox);
                    }}
                    label={<Localize i18n_default_text='Priority withdrawal' />}
                    value={priority_withdrawal_checkbox}
                />
                <Popover
                    message={
                        <Localize i18n_default_text='Pay a small fee to prioritise your withdrawal, this fee will be deducted from the withdrawal amount.' />
                    }
                    zIndex='9999'
                    alignment='top'
                    icon='info'
                    disable_message_icon
                />
            </div>
            {priority_withdrawal_checkbox && crypto_estimations_fee_unique_id && (
                <div className='withdrawal-crypto-priority__info'>
                    <div className='withdrawal-crypto-priority__info--flex'>
                        <Text as='p' size='xxs' line_height='l'>
                            <Localize i18n_default_text='Withdrawal amount:' />
                        </Text>
                        <Text as='p' size='xxs' line_height='l'>
                            {Number(converter_from_amount).toFixed(decimal_places)} {currency}
                        </Text>
                    </div>
                    <div className='withdrawal-crypto-priority__info--flex'>
                        <Text as='p' size='xxs' line_height='l'>
                            <Localize i18n_default_text='Transaction fee' />
                            <Text as='span' size='xxs' line_height='l' weight='lighter'>
                                ({count_down}s)
                            </Text>
                            :
                        </Text>
                        <Popover
                            message={
                                <Localize
                                    i18n_default_text='Fee calculated at {{ time_stamp }}'
                                    values={{
                                        time_stamp: server_time,
                                    }}
                                />
                            }
                            zIndex='9999'
                            alignment='top'
                            icon='info'
                            disable_target_icon
                            disable_message_icon
                        >
                            <Text as='p' size='xxs' line_height='l' className='text-decoration-underline '>
                                {Number(crypto_estimations_fee).toFixed(decimal_places)} {currency}
                            </Text>
                        </Popover>
                    </div>
                    <hr className='withdrawal-crypto-priority__info-divider' />
                    <div className='withdrawal-crypto-priority__info--flex'>
                        <Text as='p' size='xxs' line_height='l'>
                            <Localize i18n_default_text='Amount received:' />
                        </Text>
                        <Text as='p' size='xxs' line_height='l' weight='bold'>
                            {Number(converter_from_amount)
                                ? (
                                      parseFloat(Number(converter_from_amount).toFixed(decimal_places)) -
                                      Number(crypto_estimations_fee)
                                  ).toFixed(decimal_places)
                                : Number(converter_from_amount).toFixed(decimal_places)}{' '}
                            {currency}
                        </Text>
                    </div>
                </div>
            )}
        </>
    );
});

export default WithdrawalCryptoPriority;
