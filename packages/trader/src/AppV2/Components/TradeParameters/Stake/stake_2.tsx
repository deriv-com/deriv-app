import React, { useEffect } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { ActionSheet, TextField, TextFieldWithSteppers, useSnackbar } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces, isCryptocurrency } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import StakeDetails from './stake-details';
import useContractsForCompany from 'AppV2/Hooks/useContractsForCompany';
import { TTradeParametersProps } from '../trade-parameters';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';

const Stake = observer(({ is_minimized }: TTradeParametersProps) => {
    const trade_store = useTraderStore();
    const {
        amount,
        commission,
        contract_type,
        currency,
        has_open_accu_contract,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        is_market_closed,
        onChange,
        proposal_info,
        stop_out,
        symbol,
        trade_type_tab,
        trade_types,
        validation_errors,
        validation_params,
    } = trade_store;

    const [is_open, setIsOpen] = React.useState(false);
    const [new_input_value, setNewInputValue] = React.useState(amount);
    const [stake_error, setStakeError] = React.useState('');

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
    console.log('trade_types', trade_types);
    console.log('contract_types', contract_types);

    // const new_values = { name: 'amount', value: new_input_value };
    // const proposal_req = getProposalRequestObject({
    //     new_values,
    //     trade_store,
    //     trade_type: Object.keys(trade_types)[0],
    // });

    // const { data: response } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
    //     ['proposal', ...Object.entries(new_values).flat().join('-'), Object.keys(trade_types)[0]],
    //     proposal_req,
    //     {
    //         enabled: is_enabled,
    //     }
    // );

    const onClose = React.useCallback(() => setIsOpen(false), []);

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
        const value = Number(e.target.value);
        // TODO: check if we need to replace not allowed signers
        // let value = String(e.target.value);
        // if (value.length > 1) value = /^[0-]+$/.test(value) ? '0' : value.replace(/^0*/, '').replace(/^\./, '0.');

        // If a new value is equal to a previous one, then we won't send API request
        const is_equal = value === new_input_value;
        is_api_response_received_ref.current = is_equal;
        if (is_equal) return;
        console.log('value', value);

        // setFEErrorText('');
        setNewInputValue(value);
    };

    const onSave = () => {
        // Prevent from saving if user clicks before BE validation
        if (!is_api_response_received_ref.current) return;
        // TODO: Check for errors
        // TODO: call onChange if there will be no errors
        console.log('Saved!');
        onClose();
    };

    // React.useEffect(() => {
    //     const onProposalResponse: TOnProposalResponse = response => {
    //         const { error, proposal } = response;

    //         const new_error = error?.message ?? '';
    //         const is_error_field_match = error?.details?.field === type || !error?.details?.field;
    //         setErrorText(is_error_field_match ? new_error : '');
    //         updateParentRef({
    //             field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
    //             new_value: is_error_field_match ? new_error : '',
    //         });

    //         // Recovery for min and max allowed values in case of error
    //         if (!info.min_value || !info.max_value) {
    //             const { min, max } = (proposal as ExpandedProposal)?.validation_params?.[type] ?? {};
    //             setInfo(info =>
    //                 (info.min_value !== min && min) || (info.max_value !== max && max)
    //                     ? { min_value: min, max_value: max }
    //                     : info
    //             );
    //         }
    //         is_api_response_received_ref.current = true;
    //     };

    //     if (response) onProposalResponse(response);
    // }, [response]);

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
        <>
            <TextField
                disabled={has_open_accu_contract || is_market_closed}
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Stake' key={`stake${is_minimized ? '-minimized' : ''}`} />}
                noStatusIcon
                onClick={() => setIsOpen(true)}
                value={`${amount} ${getCurrencyDisplayCode(currency)}`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                status={stake_error ? 'error' : 'neutral'}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Stake' />} />
                    <ActionSheet.Content className='stake-content'>
                        <TextFieldWithSteppers
                            allowDecimals
                            allowSign={false}
                            className='text-field--custom'
                            customType='commaRemoval'
                            data-testid='dt_input_with_steppers'
                            decimals={getDecimalPlaces(currency)}
                            inputMode='decimal'
                            message={getInputMessage()}
                            minusDisabled={Number(new_input_value) - 1 <= 0}
                            name='amount'
                            noStatusIcon
                            onChange={onInputChange}
                            placeholder={localize('Amount')}
                            regex={/[^0-9.,]/g}
                            status={stake_error ? 'error' : 'neutral'}
                            shouldRound={false}
                            textAlignment='center'
                            unitLeft={getCurrencyDisplayCode(currency)}
                            value={new_input_value}
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
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Stake;
