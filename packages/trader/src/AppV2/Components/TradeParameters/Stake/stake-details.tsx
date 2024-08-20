import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { FormatUtils } from '@deriv-com/utils';
import { getCurrencyDisplayCode, getTradeTypeName, TRADE_TYPES } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TTradeStore } from 'Types';

type TStakeDetailsProps = Pick<
    TTradeStore,
    'commission' | 'contract_type' | 'currency' | 'is_multiplier' | 'stop_out'
> & {
    contract_types: string[];
    details: {
        first_contract_payout: number;
        max_payout: string | number;
        max_stake: string | number;
        min_stake: string | number;
        second_contract_payout: number;
    };
    first_contract_payout: number;
    is_loading_proposal: boolean;
    max_payout_exceeded: boolean;
    second_contract_payout: number;
    should_show_payout_details: boolean;
    stake_error: string;
};

const StakeDetails = ({
    commission,
    contract_type,
    contract_types,
    currency,
    details,
    first_contract_payout,
    is_loading_proposal,
    is_multiplier,
    max_payout_exceeded,
    should_show_payout_details,
    second_contract_payout,
    stake_error,
    stop_out,
}: TStakeDetailsProps) => {
    const stop_out_value = Math.abs(Number(stop_out));
    const commission_value = Math.abs(Number(commission));
    const getDisplayedValue = React.useCallback(
        (new_value?: number | string, current_value?: string) => {
            return ((current_value === '-' && is_loading_proposal) || stake_error) && !max_payout_exceeded
                ? '-'
                : FormatUtils.formatMoney(Number(new_value));
        },
        [is_loading_proposal, max_payout_exceeded, stake_error]
    );

    const [displayed_payout_first, setDisplayedPayoutFirst] = React.useState(getDisplayedValue(first_contract_payout));
    const [displayed_payout_second, setDisplayedPayoutSecond] = React.useState(
        getDisplayedValue(second_contract_payout)
    );
    const [displayed_stop_out, setDisplayedStopOut] = React.useState(getDisplayedValue(stop_out_value));
    const [displayed_commission, setDisplayedCommission] = React.useState(getDisplayedValue(commission_value));

    React.useEffect(() => {
        setDisplayedPayoutFirst(value => getDisplayedValue(details.first_contract_payout, value));
        setDisplayedPayoutSecond(value => getDisplayedValue(details.second_contract_payout, value));
        setDisplayedStopOut(value => getDisplayedValue(stop_out_value, value));
        setDisplayedCommission(value => getDisplayedValue(commission_value, value));
    }, [getDisplayedValue, details, stop_out_value, commission_value]);

    const payout_title = <Localize i18n_default_text='Payout' />;
    const content = [
        {
            is_displayed: is_multiplier && !should_show_payout_details,
            label: <Localize i18n_default_text='Stop out' />,
            value: displayed_stop_out,
        },
        {
            is_displayed: is_multiplier && !should_show_payout_details,
            label: <Localize i18n_default_text='Commission' />,
            value: displayed_commission,
        },
        {
            is_displayed: !!details.max_payout && should_show_payout_details,
            label: <Localize i18n_default_text='Max payout' />,
            value: FormatUtils.formatMoney(+details.max_payout),
        },
        {
            contract_type: getTradeTypeName(contract_types[0], {
                isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
            }),
            is_displayed: !!contract_types.length && should_show_payout_details,
            label: payout_title,
            has_error: details.first_contract_payout > +details.max_payout && max_payout_exceeded,
            value: displayed_payout_first,
        },
        {
            contract_type: getTradeTypeName(contract_types[1], {
                isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
            }),
            is_displayed: contract_types.length > 1 && should_show_payout_details,
            label: payout_title,
            has_error: details.second_contract_payout > +details.max_payout && max_payout_exceeded,
            value: displayed_payout_second,
        },
    ];

    return (
        <div className='stake-content__details'>
            {content.map(
                ({ contract_type, is_displayed, label, has_error, value }, idx) =>
                    is_displayed && (
                        <div
                            key={`${idx}_${value}`}
                            className={clsx('stake-content__details-row', has_error && 'error')}
                        >
                            <Text size='sm'>
                                {label}
                                {contract_type && ` (${contract_type})`}
                            </Text>
                            <Text size='sm'>
                                {value} {getCurrencyDisplayCode(currency)}
                            </Text>
                        </div>
                    )
            )}
        </div>
    );
};

export default StakeDetails;
