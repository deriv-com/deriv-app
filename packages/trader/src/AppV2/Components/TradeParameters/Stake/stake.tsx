import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, Text, TextField, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getDecimalPlaces, getTradeTypeName, TRADE_TYPES } from '@deriv/shared';
import { FormatUtils } from '@deriv-com/utils';
import { useTraderStore } from 'Stores/useTraderStores';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';

type TStakeProps = {
    is_minimized?: boolean;
};

const BASIS = {
    PAYOUT: 'payout',
    STAKE: 'stake',
};

const Stake = observer(({ is_minimized }: TStakeProps) => {
    const {
        amount,
        basis,
        commission,
        contract_type,
        currency,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        onChange,
        proposal_info,
        setV2ParamsInitialValues,
        stop_out,
        trade_type_tab,
        trade_types,
        validation_errors,
        validation_params,
        v2_params_initial_values,
    } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [should_show_error, setShouldShowError] = React.useState(true);
    const [initial_stake_value, setInitialStakeValue] = React.useState<number>();
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    // first contract type data:
    const {
        has_error: has_error_1,
        id: id_1,
        message: message_1 = '',
        payout: payout_1 = 0,
    } = proposal_info[contract_types[0]] ?? {};
    // second contract type data:
    const {
        has_error: has_error_2,
        id: id_2,
        message: message_2 = '',
        payout: payout_2 = 0,
    } = proposal_info[contract_types[1]] ?? {};
    const should_show_payout_details = !is_accumulator && !is_multiplier && !is_turbos && !is_vanilla;
    const proposal_error_message_1 = has_error_1 ? message_1 : '';
    const proposal_error_message_2 = has_error_2 ? message_2 : '';
    const proposal_error_message = proposal_error_message_1 || proposal_error_message_2 || validation_errors?.amount[0];
    /* TODO: stop using Max payout from error text as a default max payout and stop using error text for max_payout_exceeded after validation_params are added to proposal API (both success & error response):
    E.g., for max_payout_exceeded, we have to temporarily check the error text: Max payout error always contains 3 numbers, the check will work for any languages: */
    const float_number_search_regex = /\d+(\.\d+)?/g;
    const max_payout_exceeded =
        proposal_error_message_1.match(float_number_search_regex)?.length === 3 ||
        proposal_error_message_2.match(float_number_search_regex)?.length === 3;
    const error_max_payout =
        max_payout_exceeded && proposal_error_message
            ? Number(proposal_error_message.match(float_number_search_regex)?.[1])
            : 0;
    const { max_payout = error_max_payout, stake } = validation_params[contract_types[0]] ?? {};
    const { max: max_stake = 0, min: min_stake = 0 } = stake ?? {};
    const error_payout_1 = proposal_error_message_1
        ? Number(proposal_error_message_1.match(float_number_search_regex)?.[2])
        : 0;
    const error_payout_2 = proposal_error_message_2
        ? Number(proposal_error_message_2.match(float_number_search_regex)?.[2])
        : 0;
    const first_contract_payout = payout_1 || error_payout_1;
    const second_contract_payout = payout_2 || error_payout_2;
    const has_error_or_loading_proposal = has_error_1 || has_error_2 || !id_1 || !id_2;
    const validation_error_text = contract_types[1] ? validation_errors?.amount[0] : proposal_error_message;
    const main_error_message =
        (validation_error_text && error_payout_1 > error_payout_2
            ? proposal_error_message_2
            : proposal_error_message_1) || validation_error_text;
    const has_both_errors = has_error_1 && has_error_2;
    const two_contracts_error = has_both_errors || amount.toString() === '' ? main_error_message : '';
    const stake_error = contract_types[1] ? two_contracts_error : validation_error_text;

    const getDisplayedPayout = React.useCallback(
        (new_payout: number, current_payout?: string) => {
            return ((current_payout === '-' && !id_1) || stake_error) && !max_payout_exceeded
                ? '-'
                : FormatUtils.formatMoney(new_payout);
        },
        [id_1, max_payout_exceeded, stake_error]
    );

    const [displayed_payout_1, setDisplayedPayout1] = React.useState(getDisplayedPayout(first_contract_payout));
    const [displayed_payout_2, setDisplayedPayout2] = React.useState(getDisplayedPayout(second_contract_payout));
    const [info, setInfo] = React.useState({
        first_contract_payout,
        max_payout,
        max_stake,
        min_stake,
        second_contract_payout,
    });

    const multipliers_content = [
        {
            label: <Localize i18n_default_text='Stop out' />,
            value: stop_out,
        },
        {
            label: <Localize i18n_default_text='Commission' />,
            value: commission,
        },
    ];

    React.useEffect(() => {
        const initial_stake = v2_params_initial_values?.stake;
        if (initial_stake && amount !== initial_stake) {
            onChange({ target: { name: 'amount', value: initial_stake } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        setInitialStakeValue(is_open && !initial_stake_value ? amount : undefined);
        if (is_open) {
            setV2ParamsInitialValues({ value: amount, name: 'stake' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_open]);
    React.useEffect(() => {
        if (basis === BASIS.PAYOUT) onChange({ target: { name: 'basis', value: BASIS.STAKE } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);
    React.useEffect(() => {
        setDisplayedPayout1(p => getDisplayedPayout(info.first_contract_payout, p));
        setDisplayedPayout2(p => getDisplayedPayout(info.second_contract_payout, p));
    }, [getDisplayedPayout, info]);
    React.useEffect(() => {
        if (is_open) {
            setInfo(info => {
                if (
                    (info.first_contract_payout !== first_contract_payout && first_contract_payout) ||
                    (info.max_payout !== max_payout && max_payout) ||
                    (info.max_stake !== max_stake && max_stake) ||
                    (info.min_stake !== min_stake && min_stake) ||
                    (info.second_contract_payout !== second_contract_payout && second_contract_payout)
                ) {
                    return {
                        first_contract_payout,
                        max_payout,
                        max_stake,
                        min_stake,
                        second_contract_payout,
                    };
                }
                return info;
            });
        }
    }, [is_open, max_payout, max_stake, min_stake, first_contract_payout, second_contract_payout]);

    const getInputMessage = () =>
        (should_show_error && stake_error) ||
        (!!info.min_stake && !!info.max_stake && (
            <Localize
                i18n_default_text='Acceptable range: {{min_stake}} to {{max_stake}} {{currency}}'
                values={{
                    currency: getCurrencyDisplayCode(currency),
                    min_stake: FormatUtils.formatMoney(+info.min_stake),
                    max_stake: FormatUtils.formatMoney(+info.max_stake),
                }}
            />
        ));

    const handleOnChange = (e: { target: { name: string; value: string } }) => {
        setShouldShowError(e.target.value !== '');
        onChange({ target: { name: 'amount', value: e.target.value } });
    };

    const onClose = (is_saved = false) => {
        if (is_open) {
            if (!is_saved) {
                onChange({ target: { name: 'amount', value: initial_stake_value } });
            }
            setV2ParamsInitialValues({ value: amount, name: 'stake' });
            setIsOpen(false);
        }
    };

    if (basis === BASIS.PAYOUT) return null;
    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Stake' key={`stake${is_minimized ? '-minimized' : ''}`} />}
                onClick={() => setIsOpen(true)}
                value={`${amount} ${getCurrencyDisplayCode(currency)}`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => onClose(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Stake' />} />
                    <ActionSheet.Content className='stake-content'>
                        <TextFieldWithSteppers
                            allowDecimals
                            decimals={getDecimalPlaces(currency)}
                            data-testid='dt_input_with_steppers'
                            message={getInputMessage()}
                            minusDisabled={Number(amount) - 1 <= 0}
                            name='amount'
                            onChange={handleOnChange}
                            placeholder={localize('Amount')}
                            regex={/[^0-9.,]/g}
                            status={should_show_error && stake_error ? 'error' : 'neutral'}
                            textAlignment='center'
                            type='number'
                            inputMode='decimal'
                            unitLeft={getCurrencyDisplayCode(currency)}
                            variant='fill'
                            value={amount}
                        />
                        <div className='stake-content__details'>
                            {is_multiplier
                                ? multipliers_content.map(({ label, value }) => (
                                      <div key={label.props.i18n_default_text} className='stake-content__details-row'>
                                          <Text size='sm'>{label}</Text>
                                          <Text size='sm'>
                                              {has_error_or_loading_proposal || isNaN(Number(value))
                                                  ? '-'
                                                  : FormatUtils.formatMoney(Math.abs(Number(value)))}{' '}
                                              {getCurrencyDisplayCode(currency)}
                                          </Text>
                                      </div>
                                  ))
                                : should_show_payout_details && (
                                      <>
                                          {!!info.max_payout && (
                                              <div className='stake-content__details-row'>
                                                  <Text size='sm'>
                                                      <Localize i18n_default_text='Max payout' />
                                                  </Text>
                                                  <Text size='sm'>
                                                      {FormatUtils.formatMoney(+info.max_payout)}{' '}
                                                      {getCurrencyDisplayCode(currency)}
                                                  </Text>
                                              </div>
                                          )}
                                          <div
                                              className={clsx(
                                                  'stake-content__details-row',
                                                  info.first_contract_payout > +info.max_payout &&
                                                      max_payout_exceeded &&
                                                      'error'
                                              )}
                                          >
                                              <Text size='sm'>
                                                  <Localize i18n_default_text='Payout' /> (
                                                  {getTradeTypeName(contract_types[0], {
                                                      isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
                                                  })}
                                                  )
                                              </Text>
                                              <Text size='sm'>
                                                  {displayed_payout_1} {getCurrencyDisplayCode(currency)}
                                              </Text>
                                          </div>
                                          {contract_types.length > 1 && (
                                              <div
                                                  className={clsx(
                                                      'stake-content__details-row',
                                                      info.second_contract_payout > +info.max_payout &&
                                                          max_payout_exceeded &&
                                                          'error'
                                                  )}
                                              >
                                                  <Text size='sm'>
                                                      <Localize i18n_default_text='Payout' /> (
                                                      {getTradeTypeName(contract_types[1], {
                                                          isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
                                                      })}
                                                      )
                                                  </Text>
                                                  <Text size='sm'>
                                                      {displayed_payout_2} {getCurrencyDisplayCode(currency)}
                                                  </Text>
                                              </div>
                                          )}
                                      </>
                                  )}
                        </div>
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        shouldCloseOnPrimaryButtonClick={false}
                        primaryAction={{
                            content: <Localize i18n_default_text='Save' />,
                            onAction: () => {
                                if (!stake_error) {
                                    onClose(true);
                                } else {
                                    setShouldShowError(true);
                                }
                            },
                        }}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Stake;
