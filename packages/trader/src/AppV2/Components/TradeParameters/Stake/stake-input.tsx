import React from 'react';
import { observer } from 'mobx-react';

import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ActionSheet, TextFieldWithSteppers } from '@deriv-com/quill-ui';

import { useFetchProposalData } from 'AppV2/Hooks/useFetchProposalData';
import useIsVirtualKeyboardOpen from 'AppV2/Hooks/useIsVirtualKeyboardOpen';
import { getPayoutInfo } from 'AppV2/Utils/trade-params-utils';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { ExpandedProposal, getProposalInfo } from 'Stores/Modules/Trading/Helpers/proposal';
import { useTraderStore } from 'Stores/useTraderStores';
import { TTradeStore } from 'Types';

import StakeDetails from './stake-details';

type TResponse = Parameters<TTradeStore['onProposalResponse']>[0];
type TStakeInput = {
    onClose: () => void;
    is_open?: boolean;
};
type TNewValues = {
    amount?: string | number;
    payout_per_point?: string | number;
    barrier_1?: string | number;
};
type TStakeState = {
    proposal_request_values: TNewValues;
    stake_error: string;
    fe_stake_error: string;
    max_length: number;
    details: {
        commission?: string | number;
        error_1: string;
        error_2: string;
        first_contract_payout: number;
        second_contract_payout: number;
        is_first_payout_exceeded: boolean;
        is_second_payout_exceeded: boolean;
        max_payout: string | number;
        max_stake: string | number;
        min_stake: string | number;
        stop_out?: string | number;
    };
};
type TStakeAction =
    | { type: 'SET_PROPOSAL_VALUES'; payload: Partial<TNewValues> }
    | { type: 'SET_STAKE_ERROR'; payload: string }
    | { type: 'SET_FE_STAKE_ERROR'; payload: string }
    | { type: 'UPDATE_DETAILS'; payload: Partial<TStakeState['details']> }
    | { type: 'SET_MAX_LENGTH'; payload: number }
    | { type: 'RESET_ERRORS' };

const reducer = (state: TStakeState, action: TStakeAction): TStakeState => {
    switch (action.type) {
        case 'SET_PROPOSAL_VALUES':
            return {
                ...state,
                proposal_request_values: {
                    ...state.proposal_request_values,
                    ...action.payload,
                },
            };
        case 'SET_STAKE_ERROR':
            return {
                ...state,
                stake_error: action.payload,
            };
        case 'SET_FE_STAKE_ERROR':
            return {
                ...state,
                fe_stake_error: action.payload,
            };
        case 'UPDATE_DETAILS':
            return {
                ...state,
                details: {
                    ...state.details,
                    ...action.payload,
                },
            };
        case 'SET_MAX_LENGTH':
            return {
                ...state,
                max_length: action.payload,
            };
        case 'RESET_ERRORS':
            return {
                ...state,
                stake_error: '',
                fe_stake_error: '',
            };
        default:
            return state;
    }
};

const createInitialState = (trade_store: ReturnType<typeof useTraderStore>, decimals: number) => {
    const {
        amount,
        commission,
        contract_type,
        trade_type_tab,
        trade_types,
        proposal_info,
        validation_params,
        stop_out,
    } = trade_store;

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const {
        contract_payout: first_contract_payout,
        max_payout,
        error: first_payout_error,
    } = getPayoutInfo(proposal_info[contract_types[0]]);
    const { contract_payout: second_contract_payout, error: second_payout_error } = getPayoutInfo(
        proposal_info[contract_types[1]]
    );

    const { stake } = (validation_params[contract_types[0]] || validation_params[contract_types[1]]) ?? {};
    const { max: max_stake = 0, min: min_stake = 0 } = stake ?? {};

    return {
        proposal_request_values: { amount },
        stake_error: '',
        fe_stake_error: '',
        max_length: calculateMaxLength(amount, decimals),
        details: {
            commission,
            error_1: first_payout_error,
            error_2: second_payout_error,
            first_contract_payout,
            second_contract_payout,
            is_first_payout_exceeded: !!first_payout_error && first_contract_payout > max_payout,
            is_second_payout_exceeded: !!second_payout_error && second_contract_payout > max_payout,
            max_payout,
            max_stake,
            min_stake,
            stop_out,
        },
    };
};

const calculateMaxLength = (amount: number | string, decimals: number): number => {
    const is_decimal = String(amount).includes('.') || String(amount).includes(',');
    return is_decimal ? 11 + decimals : 10;
};

const StakeInput = observer(({ onClose, is_open }: TStakeInput) => {
    const trade_store = useTraderStore();
    const {
        contract_type,
        currency,
        barrier_1,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        onChange,
        trade_type_tab,
        trade_types,
    } = trade_store;

    const decimals = getDecimalPlaces(currency);
    const [state, dispatch] = React.useReducer(reducer, null, () => createInitialState(trade_store, decimals));
    const { proposal_request_values, stake_error, fe_stake_error, details } = state;

    const contract_types = React.useMemo(
        () => getDisplayedContractTypes(trade_types, contract_type, trade_type_tab),
        [trade_types, contract_type, trade_type_tab]
    );

    const should_show_payout_details = !is_accumulator && !is_multiplier && !is_turbos && !is_vanilla;

    // scroll the page when a virtual keyboard pops up
    const input_id = 'stake_input';
    const { is_key_board_visible: should_scroll } = useIsVirtualKeyboardOpen(input_id);

    React.useEffect(() => {
        if (should_scroll) window?.scrollTo({ top: 225, behavior: 'smooth' });
    }, [should_scroll]);

    React.useEffect(() => {
        const initial_state = createInitialState(trade_store, decimals);
        dispatch({ type: 'SET_PROPOSAL_VALUES', payload: initial_state.proposal_request_values });
        dispatch({ type: 'UPDATE_DETAILS', payload: initial_state.details });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Parallel proposal without subscription
    // For Rise/Fall and all Digits we should do 2 proposal requests
    const should_send_multiple_proposals = contract_types.length > 1 && !is_multiplier;
    const has_both_errors = !!details.error_1 && !!details.error_2;
    // Need for cases with Rise/Fall and Digits, when only one response contains error and we should allow to save the value
    const should_show_stake_error =
        !should_send_multiple_proposals || (should_send_multiple_proposals && has_both_errors);

    const { data: response_1, is_fetching: is_fetching_1 } = useFetchProposalData({
        trade_store,
        proposal_request_values,
        contract_type: contract_types[0],
        contract_types,
        is_enabled: is_open,
    });
    const { data: response_2, is_fetching: is_fetching_2 } = useFetchProposalData({
        trade_store,
        proposal_request_values,
        contract_type: contract_types[1],
        contract_types,
        is_enabled: is_open && should_send_multiple_proposals,
    });

    const is_loading_proposal = is_fetching_1 || (should_send_multiple_proposals && is_fetching_2);

    const handleProposalResponse = (response: TResponse, contractType: 'first' | 'second') => {
        const { error, proposal } = response;

        // In case if the value is empty we are showing custom error text from FE (in onSave function)
        if (proposal_request_values.amount === '') {
            dispatch({ type: 'SET_STAKE_ERROR', payload: '' });
            return;
        }

        // Handle edge cases for Vanilla contracts
        if (is_vanilla && error?.details?.barrier_choices) {
            const { barrier_choices } = error.details;
            if (!barrier_choices?.includes(barrier_1)) {
                const index = Math.floor(barrier_choices.length / 2);
                dispatch({
                    type: 'SET_PROPOSAL_VALUES',
                    payload: { barrier_1: barrier_choices[index] },
                });
                return;
            }
        }

        // Handle edge cases for Turbo contracts
        if (is_turbos && error?.details?.payout_per_point_choices && error?.details?.field === 'payout_per_point') {
            const { payout_per_point_choices } = error.details;
            const index = Math.floor(payout_per_point_choices.length / 2);
            dispatch({
                type: 'SET_PROPOSAL_VALUES',
                payload: { payout_per_point: payout_per_point_choices[index] },
            });
            return;
        }

        // Set proposal error
        const new_error = error?.message ?? '';
        const is_error_field_match =
            ['amount', 'stake'].includes(error?.details?.field ?? '') || !error?.details?.field;
        dispatch({ type: 'SET_STAKE_ERROR', payload: is_error_field_match ? new_error : '' });

        // Handle old contracts with payout (Rise/Fall, Higher/Lower, Touch/No Touch, Digits)
        if (should_show_payout_details) {
            const new_proposal = getProposalInfo(trade_store, response as Parameters<typeof getProposalInfo>[1]);
            const { contract_payout, max_payout, error } = getPayoutInfo(new_proposal);

            dispatch({
                type: 'UPDATE_DETAILS',
                payload: {
                    ...(max_payout ? { max_payout } : {}),
                    [`${contractType}_contract_payout`]: contract_payout || 0,
                    [`is_${contractType}_payout_exceeded`]: !!error && contract_payout > max_payout,
                    [`error_${contractType === 'first' ? 1 : 2}`]: error,
                },
            });
        } else {
            // Recovery for minimum and maximum allowed values in case of errors
            if ((!details.min_stake || !details.max_stake) && error?.details) {
                const { max_stake, min_stake } = error.details;
                if (max_stake && min_stake) {
                    dispatch({
                        type: 'UPDATE_DETAILS',
                        payload: {
                            max_stake,
                            min_stake,
                        },
                    });
                }
            }

            // Update proposal details after a successful API call
            if (proposal) {
                const { commission, limit_order, validation_params } = proposal as ExpandedProposal;
                const { max, min } = validation_params?.stake ?? {};
                const { order_amount } = limit_order?.stop_out ?? {};

                dispatch({
                    type: 'UPDATE_DETAILS',
                    payload: {
                        ...(is_multiplier && commission && order_amount ? { commission, stop_out: order_amount } : {}),
                        ...(details.max_stake || details.min_stake ? {} : { max_stake: max, min_stake: min }),
                    },
                });
            } else if (!proposal && is_multiplier) {
                dispatch({
                    type: 'UPDATE_DETAILS',
                    payload: { commission: 0, stop_out: 0 },
                });
            }
        }
    };

    React.useEffect(() => {
        if (response_1) handleProposalResponse(response_1, 'first');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response_1]);

    React.useEffect(() => {
        if (response_2) handleProposalResponse(response_2, 'second');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response_2]);

    const getInputMessage = () =>
        !!details.min_stake &&
        !!details.max_stake && (
            <Localize
                i18n_default_text='Acceptable range: {{min_stake}} to {{max_stake}} {{currency}}'
                values={{
                    currency: getCurrencyDisplayCode(currency),
                    min_stake: formatMoney(currency, +details.min_stake, true),
                    max_stake: formatMoney(currency, +details.max_stake, true),
                }}
            />
        );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const new_value = e.target.value;
        dispatch({
            type: 'SET_MAX_LENGTH',
            payload: calculateMaxLength(new_value, decimals),
        });
        if (new_value.endsWith('.')) {
            dispatch({
                type: 'SET_FE_STAKE_ERROR',
                payload: localize('Should be a valid number.'),
            });
            return;
        }
        // If a new value is equal to a previous one, then we won't send API request
        const is_equal = new_value === String(proposal_request_values.amount);
        if (is_equal) return;

        dispatch({ type: 'RESET_ERRORS' });
        dispatch({
            type: 'SET_PROPOSAL_VALUES',
            payload: { amount: new_value },
        });
    };

    const onBeforeInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (
            ['.', ','].includes((e.nativeEvent as InputEvent)?.data ?? '') &&
            (String(proposal_request_values.amount)?.length ?? 0) <= 10
        ) {
            dispatch({
                type: 'SET_MAX_LENGTH',
                payload: decimals ? 11 + decimals : 10,
            });
        }
    };

    const onSave = () => {
        // Prevent from saving if user clicks before we get theAPI response or if we get an error in response or the field is empty
        if (
            is_fetching_1 ||
            (should_send_multiple_proposals && is_fetching_2) ||
            (should_show_stake_error && stake_error) ||
            fe_stake_error
        )
            return;
        if (proposal_request_values.amount === '') {
            dispatch({
                type: 'SET_FE_STAKE_ERROR',
                payload: localize('Amount is a required field.'),
            });
            return;
        }

        // Setting new stake value to the store and send it in streaming proposal
        onChange({ target: { name: 'amount', value: proposal_request_values.amount } });
        onClose();
    };

    return (
        <React.Fragment>
            <ActionSheet.Content className='stake-content'>
                <TextFieldWithSteppers
                    allowDecimals
                    allowSign={false}
                    className='text-field--custom'
                    customType='commaRemoval'
                    data-testid='dt_input_with_steppers'
                    decimals={decimals}
                    inputMode='decimal'
                    id={input_id}
                    maxLength={state.max_length}
                    message={fe_stake_error || (should_show_stake_error && stake_error) || getInputMessage()}
                    minusDisabled={Number(proposal_request_values.amount) - 1 <= 0}
                    name='amount'
                    noStatusIcon
                    onChange={onInputChange}
                    onBeforeInput={onBeforeInputChange}
                    placeholder={localize('Amount')}
                    regex={/[^0-9.,]/g}
                    status={fe_stake_error || (should_show_stake_error && stake_error) ? 'error' : 'neutral'}
                    shouldRound={false}
                    textAlignment='center'
                    unitLeft={getCurrencyDisplayCode(currency)}
                    value={proposal_request_values.amount}
                    variant='fill'
                />
                <StakeDetails
                    contract_type={contract_type}
                    contract_types={contract_types}
                    currency={currency}
                    details={details}
                    has_stop_loss={has_stop_loss}
                    is_loading_proposal={is_loading_proposal}
                    is_multiplier={is_multiplier}
                    is_empty={!proposal_request_values.amount}
                    should_show_payout_details={should_show_payout_details}
                />
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                shouldCloseOnPrimaryButtonClick={false}
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
            />
        </React.Fragment>
    );
});

export default StakeInput;
