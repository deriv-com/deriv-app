import { PriceProposalResponse } from '@deriv/api-types';
import { convertToUnix, getDecimalPlaces, getPropertyValue, isAccumulatorContract, toMoment } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';

type TObjContractBasis = {
    text: string;
    value: string;
};

type TObjMultiplier = {
    cancellation?: string;
    limit_order?: {
        take_profit?: number;
        stop_loss?: number;
    };
    multiplier?: number;
};

type TObjAccum = {
    growth_rate?: number;
    limit_order?: {
        take_profit?: number;
    };
};

type TObjExpiry = {
    date_expiry?: number;
};

const isVisible = (elem: HTMLElement) => !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));

const map_error_field: { [key: string]: string } = {
    barrier: 'barrier_1',
    barrier2: 'barrier_2',
    date_expiry: 'expiry_date',
};

export const getProposalErrorField = (response: PriceProposalResponse) => {
    const error_field: string = getPropertyValue(response, ['error', 'details', 'field']);
    if (!error_field) {
        return null;
    }
    const error_id = map_error_field[error_field] || error_field;
    const el_error = document.getElementsByName(error_id)[0];
    return el_error && isVisible(el_error) ? error_id : null;
};

export const getProposalInfo = (
    store: ReturnType<typeof useTraderStore>,
    response: PriceProposalResponse,
    obj_prev_contract_basis: TObjContractBasis
) => {
    const proposal = response.proposal || ({} as PriceProposalResponse['proposal']);
    const profit = (proposal?.payout || 0) - (proposal?.ask_price || 0);
    const returns = (profit * 100) / (proposal?.ask_price || 1);
    const stake = proposal?.display_value;
    const basis_list = store.basis_list;

    const contract_basis: TObjContractBasis | undefined = store.is_vanilla
        ? { text: 'Payout', value: 'number_of_contracts' }
        : basis_list.find(o => o.value !== store.basis);

    const is_stake = contract_basis?.value === 'stake';
    //@ts-expect-error we are using key that does not exist in proposal
    const price = is_stake ? stake : proposal[contract_basis?.value];
    let has_increased = price > obj_prev_contract_basis.value;

    if (!obj_prev_contract_basis.value || price === obj_prev_contract_basis.value) {
        has_increased = !!null;
    }

    const obj_contract_basis = {
        text: contract_basis?.text || '',
        value: price || '',
    };

    const commission = proposal?.commission;
    const cancellation = proposal?.cancellation;
    const accumulators_details = {
        ...proposal?.contract_details,
        growth_rate: store.growth_rate,
    };

    return {
        commission,
        cancellation,
        id: proposal?.id || '',
        has_error: !!response.error,
        has_error_details: !!getProposalErrorField(response),
        //@ts-expect-error error object is not defined in api/types response
        error_code: response?.error.code,
        //@ts-expect-error error object is not defined in api/types response
        error_field: response?.error?.details?.field,
        has_increased,
        limit_order: proposal?.limit_order,
        //@ts-expect-error error object is not defined in api/types response
        message: proposal?.longcode || response?.error?.message,
        obj_contract_basis,
        payout: proposal?.payout,
        profit: profit.toFixed(getDecimalPlaces(store.currency)),
        returns: `${returns.toFixed(2)}%`,
        stake,
        spot: proposal?.spot,
        ...accumulators_details,
    };
};

export const createProposalRequests = (store: ReturnType<typeof useTraderStore>) => {
    const requests = {} as Record<string, unknown>;

    Object.keys(store.trade_types).forEach(type => {
        const new_req = createProposalRequestForContract(store, type);
        requests[type] = new_req;
    });

    return requests;
};

const setProposalMultiplier = (store: ReturnType<typeof useTraderStore>, obj_multiplier: TObjMultiplier) => {
    obj_multiplier.multiplier = store.multiplier;
    obj_multiplier.cancellation = store.has_cancellation ? store.cancellation_duration : undefined;

    obj_multiplier.limit_order = store.has_take_profit || store.has_stop_loss ? {} : undefined;

    if (store.has_take_profit && store.take_profit && obj_multiplier.limit_order) {
        obj_multiplier.limit_order.take_profit = +store.take_profit || 0; // send positive take_profit to API
    }

    if (store.has_stop_loss && store.stop_loss && obj_multiplier.limit_order) {
        obj_multiplier.limit_order.stop_loss = +store.stop_loss || 0; // send positive stop_loss to API
    }
};

const setProposalAccumulator = (store: ReturnType<typeof useTraderStore>, obj_accumulator: TObjAccum) => {
    obj_accumulator.growth_rate = store.growth_rate;

    obj_accumulator.limit_order = store.has_take_profit ? {} : undefined;

    if (store.has_take_profit && store.take_profit && obj_accumulator.limit_order) {
        obj_accumulator.limit_order.take_profit = +store.take_profit || 0; // send positive take_profit to API
    }
};

const createProposalRequestForContract = (store: ReturnType<typeof useTraderStore>, type_of_contract: string) => {
    const obj_accumulator: TObjAccum = {};
    const obj_expiry: TObjExpiry = {};
    const obj_multiplier: TObjMultiplier = {};

    if (store.expiry_type === 'endtime' && store.expiry_time) {
        const expiry_date = toMoment(store.expiry_date);
        obj_expiry.date_expiry = convertToUnix(expiry_date.unix(), store.expiry_time);
    }

    if (store.contract_type === 'multiplier') {
        setProposalMultiplier(store, obj_multiplier);
    }

    if (store.contract_type === 'accumulator') {
        setProposalAccumulator(store, obj_accumulator);
    }

    return {
        proposal: 1,
        subscribe: 1,
        amount: parseFloat(store.amount.toString()) || 0,
        basis: store.basis,
        contract_type: type_of_contract,
        currency: store.currency,
        symbol: store.symbol,
        ...(store.start_date && store.start_time && { date_start: convertToUnix(store.start_date, store.start_time) }),
        ...(store.expiry_type === 'duration'
            ? {
                  duration: parseInt(store.duration.toString()),
                  duration_unit: store.duration_unit,
              }
            : obj_expiry),
        ...((store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
            !isAccumulatorContract(type_of_contract) && {
                barrier: store.barrier_1 || store.last_digit,
            }),
        ...(store.barrier_count === 2 && !isAccumulatorContract(type_of_contract) && { barrier2: store.barrier_2 }),
        ...obj_accumulator,
        ...obj_multiplier,
    };
};
