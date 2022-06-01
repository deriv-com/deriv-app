import { convertToUnix, toMoment } from '@deriv/shared';

export const createProposalRequests = store => {
    const requests = {};

    Object.keys(store.trade_types).forEach(type => {
        const new_req = createProposalRequestForContract(store, type);
        requests[type] = new_req;
    });

    return requests;
};

const setProposalMultiplier = (store, obj_multiplier) => {
    obj_multiplier.multiplier = store.multiplier;
    obj_multiplier.cancellation = store.has_cancellation ? store.cancellation_duration : undefined;

    obj_multiplier.limit_order = store.has_take_profit || store.has_stop_loss ? {} : undefined;

    if (store.has_take_profit && store.take_profit) {
        obj_multiplier.limit_order.take_profit = +store.take_profit || 0; // send positive take_profit to API
    }

    if (store.has_stop_loss && store.stop_loss) {
        obj_multiplier.limit_order.stop_loss = +store.stop_loss || 0; // send positive stop_loss to API
    }
};

const createProposalRequestForContract = (store, type_of_contract) => {
    const obj_expiry = {};
    const obj_multiplier = {};

    if (store.expiry_type === 'endtime') {
        const expiry_date = toMoment(store.expiry_date);
        obj_expiry.date_expiry = convertToUnix(expiry_date.unix(), store.expiry_time);
    }

    if (store.contract_type === 'multiplier') {
        setProposalMultiplier(store, obj_multiplier);
    }

    return {
        proposal: 1,
        subscribe: 1,
        amount: parseFloat(store.amount) || 0,
        basis: store.basis,
        contract_type: type_of_contract,
        currency: store.currency,
        symbol: store.symbol,
        ...(store.start_date && { date_start: convertToUnix(store.start_date, store.start_time) }),
        ...(store.expiry_type === 'duration'
            ? {
                  duration: parseInt(store.duration),
                  duration_unit: store.duration_unit,
              }
            : obj_expiry),
        ...((store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) && {
            barrier: store.barrier_1 || store.last_digit,
        }),
        ...(store.barrier_count === 2 && { barrier2: store.barrier_2 }),
        ...obj_multiplier,
    };
};
