import React from 'react';
import { observer } from 'mobx-react';
import { ActionSheet, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import StakeDetails from './stake-details';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { TTradeStore } from 'Types';

type TOnProposalResponse = TTradeStore['onProposalResponse'];
type TStakeInput = {
    onClose: () => void;
    is_open?: boolean;
};

const StakeInput = observer(({ onClose, is_open }: TStakeInput) => {
    const trade_store = useTraderStore();
    const {
        amount,
        commission,
        contract_type,
        currency,
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

    const [input_value, setInputValue] = React.useState<number | string>(amount);
    const [stake_error, setStakeError] = React.useState('');
    const [fe_stake_error, setFEStakeError] = React.useState('');

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);

    // For handling cases when user clicks on Save btn before we got response from API
    const is_api_response_received_ref = React.useRef(false);

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
    });

    // TODO: Rise/Fall equal??? There is a logic in onChange func for it

    // Parallel proposal without subscription
    // TODO: replace with state
    const new_values_ref = React.useRef<Record<string, unknown>>({ amount: input_value });

    const new_values = { amount: input_value };
    // TODO: For Rise/Fall and all Digits we should do 2 proposal requests
    const should_send_multiple_proposals = contract_types.length > 1 && !is_multiplier;

    const proposal_req = getProposalRequestObject({
        // new_values: new_values_ref.current,
        new_values,
        trade_store,
        trade_type: contract_types[0],
    });
    // console.log('proposal_req', proposal_req);
    // console.log('contract_types', contract_types);

    const { data: response } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
        // ['proposal', ...Object.entries(new_values).flat().join('-'), Object.keys(trade_types)[0]],
        [
            'proposal',
            // ...Object.entries(new_values_ref.current).flat().join('-'),
            `${input_value}`,
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
            if (input_value === '') {
                setStakeError('');
                is_api_response_received_ref.current = true;
                return;
            }
            // Vanilla and Turbos
            // if (this.is_vanilla && response.error.details?.barrier_choices) {
            //     const { barrier_choices, max_stake, min_stake } = response.error.details;

            //     this.setStakeBoundary(contract_type, min_stake, max_stake);
            //     this.setBarrierChoices(barrier_choices as string[]);
            //     if (!this.barrier_choices.includes(this.barrier_1)) {
            //         // Since on change of duration `proposal` API call is made which returns a new set of barrier values.
            //         // The new list is set and the mid value is assigned
            //         const index = Math.floor(this.barrier_choices.length / 2);
            //         this.barrier_1 = this.barrier_choices[index];
            //         this.onChange({
            //             target: {
            //                 name: 'barrier_1',
            //                 value: this.barrier_1,
            //             },
            //         });
            //     }
            // }
            if (is_turbos && error?.details?.payout_per_point_choices) {
                const { payout_per_point_choices } = error.details;
                const payoutIndex = Math.floor(payout_per_point_choices.length / 2);
                // new_values_ref.current = {
                //     ...new_values_ref.current,
                //     payout_per_point: payout_per_point_choices[payoutIndex],
                // };
                is_api_response_received_ref.current = true;
                return;
                // this.setPayoutChoices(payout_per_point_choices.map(item => String(item)));
                // this.setStakeBoundary(contract_type, min_stake, max_stake);
                // this.onChange({
                //     target: {
                //         name: 'payout_per_point',
                //         value: String(payout_per_point_choices[payoutIndex]),
                //     },
                // });
                // this.barrier_1 = String(this.getTurbosChartBarrier(response));
            }
            const new_error = error?.message ?? '';
            const is_error_field_match =
                ['amount', 'stake'].includes(error?.details?.field ?? '') || !error?.details?.field;
            setStakeError(is_error_field_match ? new_error : '');

            // // Recovery for min and max allowed values in case of error
            // if (!info.min_value || !info.max_value) {
            //     const { min, max } = (proposal as ExpandedProposal)?.validation_params?.[type] ?? {};
            //     setInfo(info =>
            //         (info.min_value !== min && min) || (info.max_value !== max && max)
            //             ? { min_value: min, max_value: max }
            //             : info
            //     );
            // }
            is_api_response_received_ref.current = true;
        };

        if (response) onProposalResponse(response);
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
        const is_equal = new_value === String(input_value);
        is_api_response_received_ref.current = is_equal;
        if (is_equal) return;

        setStakeError('');
        setFEStakeError('');
        // Check for preventing cases when empty string converted to number will be equal 0
        const is_empty = new_value === '';
        setInputValue(is_empty ? new_value : Number(new_value));
    };

    const onSave = () => {
        // console.log('is_api_response_received_ref.current', is_api_response_received_ref.current);
        // Prevent from saving if user clicks before we get theAPI response or if we get an error in response
        if (!is_api_response_received_ref.current || stake_error) return;
        // Check, tht value is not empty
        if (input_value === '') {
            setFEStakeError(localize('Amount is a required field.'));
            return;
        }
        // Setting new stake value to the store and send it in streaming proposal
        onChange({ target: { name: 'amount', value: input_value } });
        onClose();
    };

    React.useEffect(() => {
        if (!is_open) return;
        if (
            (details.first_contract_payout !== first_contract_payout && first_contract_payout) ||
            (details.max_payout !== max_payout && max_payout) ||
            (details.max_stake !== max_stake && max_stake) ||
            (details.min_stake !== min_stake && min_stake) ||
            (details.second_contract_payout !== second_contract_payout && second_contract_payout)
        ) {
            setDetails({
                first_contract_payout,
                max_payout,
                max_stake,
                min_stake,
                second_contract_payout,
            });
        }
    }, [details, is_open, max_payout, max_stake, min_stake, first_contract_payout, second_contract_payout]);

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
                    minusDisabled={Number(input_value) - 1 <= 0}
                    name='amount'
                    noStatusIcon
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    regex={/[^0-9.,]/g}
                    status={fe_stake_error || stake_error ? 'error' : 'neutral'}
                    shouldRound={false}
                    textAlignment='center'
                    unitLeft={getCurrencyDisplayCode(currency)}
                    value={input_value}
                    variant='fill'
                />
                <StakeDetails
                    commission={commission}
                    contract_type={contract_type}
                    contract_types={contract_types}
                    currency={currency}
                    details={details}
                    has_stop_loss={has_stop_loss}
                    is_loading_proposal={is_loading_proposal}
                    is_multiplier={is_multiplier}
                    is_max_payout_exceeded={is_max_payout_exceeded}
                    should_show_payout_details={!is_accumulator && !is_multiplier && !is_turbos && !is_vanilla}
                    stake_error={stake_error}
                    stop_out={stop_out}
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
