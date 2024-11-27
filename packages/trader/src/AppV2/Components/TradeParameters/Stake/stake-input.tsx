import React from 'react';
import { observer } from 'mobx-react';

import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ActionSheet, TextFieldWithSteppers } from '@deriv-com/quill-ui';

import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { ExpandedProposal } from 'Stores/Modules/Trading/Helpers/proposal';
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
        validation_errors,
        validation_params,
    } = trade_store;

    const [proposal_request_values, setNewValues] = React.useState<TNewValues>({ amount }); // contains information for creating proposal request: stake (amount), payout_per_point for Turbos and barrier_1 for Vanillas
    const [stake_error, setStakeError] = React.useState('');
    const [fe_stake_error, setFEStakeError] = React.useState('');

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);

    // First contract type data:
    const {
        has_error: has_error_1,
        id: id_1,
        message: message_1 = '',
        payout: payout_1 = 0,
        error_field: error_field_1,
    } = proposal_info[contract_types[0]] ?? {};
    const proposal_error_message_1 =
        has_error_1 && (error_field_1 === 'amount' || error_field_1 === 'stake') ? message_1 : '';

    // Second contract type data:
    const {
        has_error: has_error_2,
        id: id_2,
        message: message_2 = '',
        payout: payout_2 = 0,
        error_field: error_field_2,
    } = proposal_info[contract_types[1]] ?? {};
    const proposal_error_message_2 =
        has_error_2 && (error_field_2 === 'amount' || error_field_2 === 'stake') ? message_2 : '';

    // TODO: Can we replace it with os_fetching?
    const is_loading_proposal = !has_error_1 && !has_error_2 && (!id_1 || (!!contract_types[1] && !id_2));

    /* TODO: stop using Max payout from error text as a default max payout and stop using error text for is_max_payout_exceeded after validation_params are added to proposal API (both success & error response):
    E.g., for is_max_payout_exceeded, we have to temporarily check the error text: Max payout error always contains 3 numbers, the check will work for any languages: */
    const float_number_search_regex = /\d+(\.\d+)?/g;
    // Extracting the value of exceeded payout 1 from error text
    const error_payout_1 = proposal_error_message_1
        ? Number(proposal_error_message_1.match(float_number_search_regex)?.[2])
        : 0;
    // Extracting the value of exceeded payout 2 from error text
    const error_payout_2 = proposal_error_message_2
        ? Number(proposal_error_message_2.match(float_number_search_regex)?.[2])
        : 0;
    const is_max_payout_exceeded =
        proposal_error_message_1.match(float_number_search_regex)?.length === 3 ||
        proposal_error_message_2.match(float_number_search_regex)?.length === 3;
    const has_both_errors = has_error_1 && has_error_2;
    const proposal_error_with_two_contract = contract_types[1] && has_both_errors;
    const proposal_error_with_one_contract = !(contract_types[1] && !has_both_errors) && proposal_error_message_1;
    const proposal_error_message = proposal_error_with_two_contract
        ? proposal_error_message_1 || proposal_error_message_2 || validation_errors?.amount?.[0]
        : proposal_error_with_one_contract || validation_errors?.amount?.[0];
    // Extracting the value of max payout from error text
    const error_max_payout =
        is_max_payout_exceeded && proposal_error_message
            ? Number(proposal_error_message.match(float_number_search_regex)?.[1])
            : 0;
    const first_contract_payout = payout_1 || error_payout_1;
    const second_contract_payout = payout_2 || error_payout_2;

    const { payout, stake } = (validation_params[contract_types[0]] || validation_params[contract_types[1]]) ?? {};
    const { max: max_payout = error_max_payout } = payout ?? {};
    const { max: max_stake = 0, min: min_stake = 0 } = stake ?? {};

    const [details, setDetails] = React.useState({
        first_contract_payout,
        second_contract_payout,
        max_payout,
        max_stake,
        min_stake,
        commission,
        stop_out,
    });

    // TODO: Rise/Fall equal??? There is a logic in onChange func for it

    // Parallel proposal without subscription
    // TODO: For Rise/Fall and all Digits we should do 2 proposal requests
    const should_send_multiple_proposals = contract_types.length > 1 && !is_multiplier;

    const proposal_req = getProposalRequestObject({
        new_values: proposal_request_values,
        trade_store,
        trade_type: contract_types[0],
    });
    const { data: response, is_fetching } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
        [
            'proposal',
            ...Object.entries(proposal_request_values).flat().join('-'),
            `${proposal_request_values?.amount}`,
            JSON.stringify(proposal_req),
            contract_types.join('-'),
        ],
        proposal_req,
        {
            enabled: is_open,
        }
    );

    React.useEffect(() => {
        const onProposalResponse: TOnProposalResponse = response => {
            const { error, proposal } = response;
            // console.log('response', response);
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

            // TODO: set proposal whole response?
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
        };

        if (response) onProposalResponse(response);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

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
        if (is_fetching || stake_error) return;
        if (proposal_request_values.amount === '') {
            setFEStakeError(localize('Amount is a required field.'));
            return;
        }

        // Setting new stake value to the store and send it in streaming proposal
        onChange({ target: { name: 'amount', value: proposal_request_values.amount } });
        onClose();
    };

    // TODO: do we need it now?
    // React.useEffect(() => {
    //     if (!is_open) return;
    //     if (
    //         (details.first_contract_payout !== first_contract_payout && first_contract_payout) ||
    //         (details.max_payout !== max_payout && max_payout) ||
    //         (details.max_stake !== max_stake && max_stake) ||
    //         (details.min_stake !== min_stake && min_stake) ||
    //         (details.second_contract_payout !== second_contract_payout && second_contract_payout)
    //     ) {
    //         setDetails({
    //             first_contract_payout,
    //             max_payout,
    //             max_stake,
    //             min_stake,
    //             second_contract_payout,
    //         });
    //     }
    // }, [details, is_open, max_payout, max_stake, min_stake, first_contract_payout, second_contract_payout]);

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
                    message={fe_stake_error || stake_error || getInputMessage()}
                    minusDisabled={Number(proposal_request_values.amount) - 1 <= 0}
                    name='amount'
                    noStatusIcon
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    regex={/[^0-9.,]/g}
                    status={fe_stake_error || stake_error ? 'error' : 'neutral'}
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
                    is_max_payout_exceeded={is_max_payout_exceeded}
                    should_show_payout_details={!is_accumulator && !is_multiplier && !is_turbos && !is_vanilla}
                    stake_error={!proposal_request_values.amount || !!stake_error}
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
