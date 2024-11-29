import React from 'react';
import { observer } from 'mobx-react';

import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ActionSheet, TextFieldWithSteppers } from '@deriv-com/quill-ui';

import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { ExpandedProposal, getProposalInfo } from 'Stores/Modules/Trading/Helpers/proposal';
import { useTraderStore } from 'Stores/useTraderStores';
import { TTradeStore } from 'Types';

import StakeDetails from './stake-details';

type TOnProposalResponse = TTradeStore['onProposalResponse'];
type TStakeInput = {
    onClose: () => void;
    is_open?: boolean;
};
type TNewValues = {
    amount?: string | number;
    payout_per_point?: string | number;
    barrier_1?: string | number;
};

const StakeInput = observer(({ onClose, is_open }: TStakeInput) => {
    const trade_store = useTraderStore();
    const {
        amount,
        commission,
        contract_type,
        currency,
        barrier_1,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        onChange,
        proposal_info,
        stop_out,
        trade_type_tab,
        trade_types,
        validation_params,
    } = trade_store;

    const [proposal_request_values, setNewValues] = React.useState<TNewValues>({ amount }); // contains information for creating proposal request: stake (amount), payout_per_point for Turbos and barrier_1 for Vanillas
    const [stake_error, setStakeError] = React.useState('');
    const [fe_stake_error, setFEStakeError] = React.useState('');

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const should_show_payout_details = !is_accumulator && !is_multiplier && !is_turbos && !is_vanilla;

    // TODO: move outside
    const getPayoutInfo = (proposal_info: ReturnType<typeof getProposalInfo>) => {
        // getting current payout
        const { has_error, message = '', payout = 0, error_field } = proposal_info ?? {};
        const float_number_search_regex = /\d+(\.\d+)?/g;
        const is_error_matching = has_error && (error_field === 'amount' || error_field === 'stake');
        const proposal_error_message = is_error_matching ? message : '';
        /* TODO: stop using error text for getting the payout value, need API changes */
        // Extracting the value of exceeded payout from error text
        const error_payout = proposal_error_message
            ? Number(proposal_error_message.match(float_number_search_regex)?.[2])
            : 0;
        const contract_payout = payout || error_payout;

        // getting max allowed payout
        const { payout: validation_payout } =
            (proposal_info?.validation_params || proposal_info?.validation_params) ?? {};
        const { max } = validation_payout ?? {};
        /* TODO: stop using error text for getting the max payout value, need API changes */
        // Extracting the value of max payout from error text
        const error_max_payout =
            is_error_matching && message ? Number(message.match(float_number_search_regex)?.[1]) : 0;
        const max_payout = max || error_max_payout;

        return { contract_payout, max_payout, error: proposal_error_message };
    };

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

    const [details, setDetails] = React.useState({
        commission,
        error_1: first_payout_error,
        error_2: second_payout_error,
        first_contract_payout,
        is_first_payout_exceed: !!first_payout_error && first_contract_payout > max_payout,
        is_second_payout_exceed: !!second_payout_error && second_contract_payout > max_payout,
        second_contract_payout,
        max_payout,
        max_stake,
        min_stake,
        stop_out,
    });

    // Parallel proposal without subscription
    // For Rise/Fall and all Digits we should do 2 proposal requests
    const should_send_multiple_proposals = contract_types.length > 1 && !is_multiplier;
    const has_both_errors = !!details.error_1 && !!details.error_2;
    // Need for cases with Rise/Fall and Digits, when only one response contains error and we should allow to save the value
    const should_show_stake_error =
        !should_send_multiple_proposals || (should_send_multiple_proposals && has_both_errors);

    const proposal_req_1 = getProposalRequestObject({
        new_values: proposal_request_values,
        trade_store,
        trade_type: contract_types[0],
    });
    const { data: response_1, is_fetching: is_fetching_1 } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
        [
            'proposal',
            ...Object.entries(proposal_request_values).flat().join('-'),
            `${proposal_request_values?.amount}`,
            JSON.stringify(proposal_req_1),
            contract_types.join('-'),
        ],
        proposal_req_1,
        {
            enabled: is_open,
        }
    );

    const proposal_req_2 = getProposalRequestObject({
        new_values: proposal_request_values,
        trade_store,
        trade_type: contract_types[1],
    });
    const { data: response_2, is_fetching: is_fetching_2 } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
        [
            'proposal',
            ...Object.entries(proposal_request_values).flat().join('-'),
            `${proposal_request_values?.amount}`,
            JSON.stringify(proposal_req_2),
            contract_types.join('-'),
        ],
        proposal_req_2,
        {
            enabled: is_open && should_send_multiple_proposals,
        }
    );

    const is_loading_proposal = is_fetching_1 || (should_send_multiple_proposals && is_fetching_2);

    React.useEffect(() => {
        const onProposalResponse: TOnProposalResponse = response => {
            const { error, proposal } = response;

            // In case if the value is empty we are showing custom error text from FE (in onSave function)
            if (proposal_request_values.amount === '') {
                setStakeError('');
                return;
            }

            // Edge cases for Vanilla and Turbos
            if (is_vanilla && error?.details?.barrier_choices) {
                const { barrier_choices } = error.details;
                if (!barrier_choices?.includes(barrier_1)) {
                    const index = Math.floor(barrier_choices.length / 2);
                    setNewValues(prev => ({ ...prev, barrier_1: barrier_choices[index] as string }));
                    return;
                }
            }
            // Sometimes the initial payout_per_point doesn't match with current payout_per_point_choices received from API.
            // When this happens we want to populate the list of barrier choices to choose from since the value cannot be specified manually
            // This is the same logic as in trade-store
            if (is_turbos && error?.details?.payout_per_point_choices && error?.details?.field === 'payout_per_point') {
                const { payout_per_point_choices } = error.details;
                const index = Math.floor(payout_per_point_choices.length / 2);
                setNewValues(prev => ({ ...prev, payout_per_point: payout_per_point_choices[index] }));
                return;
            }

            // Setting proposal error
            const new_error = error?.message ?? '';
            const is_error_field_match =
                ['amount', 'stake'].includes(error?.details?.field ?? '') || !error?.details?.field;
            setStakeError(is_error_field_match ? new_error : '');

            // Handling old contracts with payout (Rise/Fall, Higher/Lower, Touch/No Touch, Digits)
            if (should_show_payout_details) {
                const new_proposal = getProposalInfo(trade_store, response as Parameters<typeof getProposalInfo>[1]);
                const { contract_payout, max_payout, error } = getPayoutInfo(new_proposal);
                const new_stake_details_values = {
                    ...(max_payout ? { max_payout } : {}),
                    first_contract_payout: contract_payout || 0,
                    is_first_payout_exceed: !!error && contract_payout > max_payout,
                    error_1: error,
                };

                setDetails(prev => ({ ...prev, ...new_stake_details_values }));
            } else {
                // Recovery for min and max allowed values in case of error
                if ((!details.min_stake || !details.max_stake) && error?.details) {
                    const { max_stake, min_stake } = error.details;

                    if (max_stake && min_stake)
                        setDetails(prev => ({
                            ...prev,
                            max_stake,
                            min_stake,
                        }));
                }

                // Setting stake details from new proposal response
                if (proposal) {
                    const { commission, limit_order, validation_params } = proposal as ExpandedProposal;
                    const { max, min } = validation_params?.stake ?? {};
                    const { order_amount } = limit_order?.stop_out ?? {};

                    const new_stake_details_values = {
                        ...(is_multiplier && commission && order_amount ? { commission, stop_out: order_amount } : {}),
                        ...(details.max_stake || details.min_stake ? {} : { max_stake: max, min_stake: min }),
                    };

                    setDetails(prev => ({ ...prev, ...new_stake_details_values }));
                }
            }
        };

        if (response_1) onProposalResponse(response_1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response_1]);

    React.useEffect(() => {
        const onProposalResponse: TOnProposalResponse = response => {
            const { error: proposal_error } = response;

            // In case if the value is empty we are showing custom error text from FE (in onSave function)
            if (proposal_request_values.amount === '') return;

            // Setting proposal error
            const new_error = proposal_error?.message ?? '';
            const is_error_field_match =
                ['amount', 'stake'].includes(proposal_error?.details?.field ?? '') || !proposal_error?.details?.field;
            setStakeError(is_error_field_match ? new_error : '');

            const new_proposal = getProposalInfo(trade_store, response as Parameters<typeof getProposalInfo>[1]);
            const { contract_payout, max_payout, error } = getPayoutInfo(new_proposal);

            const new_stake_details_values = {
                ...(max_payout ? { max_payout } : {}),
                second_contract_payout: contract_payout || 0,
                is_second_payout_exceed: !!error && contract_payout > max_payout,
                error_2: error,
            };

            setDetails(prev => ({ ...prev, ...new_stake_details_values }));
        };

        if (response_2) onProposalResponse(response_2);
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
        // If a new value is equal to a previous one, then we won't send API request
        const is_equal = new_value === String(proposal_request_values.amount);
        if (is_equal) return;

        setFEStakeError('');
        setNewValues(prev => ({ ...prev, amount: new_value }));
    };

    const onSave = () => {
        // Prevent from saving if user clicks before we get theAPI response or if we get an error in response or the field is empty
        if (
            is_fetching_1 ||
            (should_send_multiple_proposals && is_fetching_2) ||
            (should_show_stake_error && stake_error)
        )
            return;
        if (proposal_request_values.amount === '') {
            setFEStakeError(localize('Amount is a required field.'));
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
                    decimals={getDecimalPlaces(currency)}
                    inputMode='decimal'
                    message={fe_stake_error || (should_show_stake_error && stake_error) || getInputMessage()}
                    minusDisabled={Number(proposal_request_values.amount) - 1 <= 0}
                    name='amount'
                    noStatusIcon
                    onChange={onInputChange}
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
