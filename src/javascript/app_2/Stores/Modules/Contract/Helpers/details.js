import React                      from 'react';
import { addComma }               from '_common/base/currency_base';
import { localize }               from '_common/localize';
import Money                      from 'App/Components/Elements/money.jsx';
import { getContractTypeDisplay } from 'Constants/contract';
import { toGMTFormat }            from 'Utils/Date';

const detailsProps = (() => {
    let details_props;

    const initDetailsProps = () => ({
        contract_type : localize('Contract Type'),
        start_time    : localize('Start Time'),
        entry_spot    : localize('Entry Spot'),
        purchase_price: localize('Purchase Price'),
        end_time      : localize('End Time'),
        exit_spot     : localize('Exit Spot'),
        exit_spot_time: localize('Exit Spot Time'),
        payout        : localize('Payout'),
    });

    return {
        get: () => {
            if (!details_props) {
                details_props = initDetailsProps();
            }
            return details_props;
        },
    };
})();

export const getDetailsInfo = (contract_info) => {
    const {
        buy_price,
        contract_type,
        currency,
        date_start,
        entry_spot,
        sell_time,
    } = contract_info;

    const details_props = detailsProps.get();

    // if a forward starting contract was sold before starting
    // API will still send entry spot when start time is passed
    // we will hide it from our side
    const is_sold_before_start = sell_time && +sell_time < +date_start;
    const txt_start_time       = date_start && toGMTFormat(+date_start * 1000);
    const txt_entry_spot       = entry_spot && !is_sold_before_start ? addComma(entry_spot) : '-';

    return {
        [details_props.contract_type] : getContractTypeDisplay(contract_type),
        [details_props.start_time]    : txt_start_time,
        [details_props.entry_spot]    : txt_entry_spot,
        [details_props.purchase_price]: <Money amount={buy_price} currency={currency} />,
    };
};

export const formatMoney = (currency, amount) => <Money amount={amount} currency={currency} />;

export const getDetailsExpiry = (store) => {
    if (!store.is_ended) return {};

    const {
        contract_info,
        end_spot,
        end_spot_time,
        indicative_price,
        is_user_sold,
    } = store;

    const details_props = detailsProps.get();

    // for user sold contracts sell spot can get updated when the next tick becomes available
    // so we only show end time instead of any spot information
    return {
        ...(is_user_sold ? {
            [details_props.end_time]: contract_info.date_expiry && toGMTFormat(+contract_info.date_expiry * 1000),
        } : {
            [details_props.exit_spot]     : end_spot ? addComma(end_spot) : '-',
            [details_props.exit_spot_time]: end_spot_time ? toGMTFormat(+end_spot_time * 1000) : '-',
        }),
        [details_props.payout]: <Money amount={indicative_price} currency={contract_info.currency} />,
    };
};
