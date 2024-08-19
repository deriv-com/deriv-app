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
        stop_out,
        trade_type_tab,
        trade_types,
        validation_errors,
        validation_params,
    } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [should_show_error, setShouldShowError] = React.useState(true);
    const [initial_stake_value, setInitialStakeValue] = React.useState<number>();
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const { has_error, id, message = '', payout: main_btn_payout = 0 } = proposal_info[contract_types[0]] ?? {};
    const {
        has_error: has_error_2,
        message: message_2 = '',
        payout: second_btn_payout = 0,
    } = proposal_info[contract_types[1]] ?? {};
    const proposal_error_message =
        message !== validation_errors?.amount[0] && has_error ? message : validation_errors?.amount[0];
    const validation_error_text = contract_types[1] ? validation_errors?.amount[0] : proposal_error_message;
    // TODO: stop extracting max payout from error message after it's added to validation_params in proposal API:
    const error_max_payout = validation_error_text ? Number(message.match(/\d+(\.\d+)?/g)?.[1]) : 0;
    const { max_payout = error_max_payout, stake } = validation_params[contract_types[0]] ?? {};
    const { max: max_stake = 0, min: min_stake = 0 } = stake ?? {};
    const error_payout_1 = message ? Number(message.match(/\d+(\.\d+)?/g)?.[2]) : 0;
    const error_payout_2 = message_2 ? Number(message_2.match(/\d+(\.\d+)?/g)?.[2]) : 0;
    const main_button_payout = main_btn_payout || error_payout_1;
    const second_button_payout = second_btn_payout || error_payout_2;
    const has_error_or_loading_proposal = has_error || !id;
    const main_error_message =
        (validation_error_text && error_payout_1 > error_payout_2 ? message_2 : message) || validation_error_text;
    const has_both_errors = has_error && has_error_2;
    const two_contracts_error = has_both_errors || amount.toString() === '' ? main_error_message : '';
    const stake_error = contract_types[1] ? two_contracts_error : validation_error_text;
    const max_payout_exceeded = !!(/maximum payout/i.test(message) || /maximum payout/i.test(message_2));
    const should_show_payout_details = !is_accumulator && !is_multiplier && !is_turbos && !is_vanilla;
    const getDisplayedPayout = React.useCallback(
        (new_payout: number, current_payout?: string) => {
            return ((current_payout === '-' && !id) || stake_error) && !max_payout_exceeded
                ? '-'
                : FormatUtils.formatMoney(new_payout);
        },
        [id, max_payout_exceeded, stake_error]
    );
    const [displayed_payout_1, setDisplayedPayout1] = React.useState(getDisplayedPayout(main_button_payout));
    const [displayed_payout_2, setDisplayedPayout2] = React.useState(getDisplayedPayout(second_button_payout));

    const [info, setInfo] = React.useState({
        max_payout,
        max_stake,
        main_button_payout,
        min_stake,
        second_button_payout,
    });

    const mult_content = [
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
        setInitialStakeValue(is_open && !initial_stake_value ? amount : undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_open]);
    React.useEffect(() => {
        if (basis === BASIS.PAYOUT) onChange({ target: { name: 'basis', value: BASIS.STAKE } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);
    React.useEffect(() => {
        setDisplayedPayout1(p => getDisplayedPayout(info.main_button_payout, p));
        setDisplayedPayout2(p => getDisplayedPayout(info.second_button_payout, p));
    }, [getDisplayedPayout, info]);
    React.useEffect(() => {
        if (is_open) {
            setInfo(info => {
                if (
                    (info.max_payout !== max_payout && max_payout) ||
                    (info.max_stake !== max_stake && max_stake) ||
                    (info.main_button_payout !== main_button_payout && main_button_payout) ||
                    (info.min_stake !== min_stake && min_stake) ||
                    (info.second_button_payout !== second_button_payout && second_button_payout)
                ) {
                    return {
                        max_payout,
                        max_stake,
                        main_button_payout,
                        min_stake,
                        second_button_payout,
                    };
                }
                return info;
            });
        }
    }, [is_open, max_payout, max_stake, min_stake, main_button_payout, second_button_payout]);

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
                    <ActionSheet.Content>
                        <div className='stake-content'>
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
                            {is_multiplier ? (
                                <div className='multipliers-info__wrapper'>
                                    {mult_content.map(({ label, value }) => (
                                        <div key={label.props.i18n_default_text} className='multipliers-info__row'>
                                            <Text size='sm' className='multipliers-info__title'>
                                                {label}
                                            </Text>
                                            <Text size='sm' bold>
                                                {has_error_or_loading_proposal || isNaN(Number(value))
                                                    ? '-'
                                                    : FormatUtils.formatMoney(Number(value))}{' '}
                                                {getCurrencyDisplayCode(currency)}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                should_show_payout_details && (
                                    <>
                                        {!!info.max_payout && (
                                            <div className='barrier-params__max-payout-wrapper'>
                                                <Text size='sm'>
                                                    <Localize i18n_default_text='Max payout' />
                                                </Text>
                                                <Text size='sm'>
                                                    {FormatUtils.formatMoney(+info.max_payout)}{' '}
                                                    {getCurrencyDisplayCode(currency)}
                                                </Text>
                                            </div>
                                        )}
                                        <div className='barrier-params__button-payout-wrapper'>
                                            <Text size='sm'>
                                                <Localize i18n_default_text='Payout' />
                                            </Text>
                                            (
                                            {getTradeTypeName(contract_types[0], {
                                                isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
                                            })}
                                            )
                                            <Text size='sm'>
                                                {displayed_payout_1} {getCurrencyDisplayCode(currency)}
                                            </Text>
                                        </div>
                                        {contract_types.length > 1 && (
                                            <div className='barrier-params__button-payout-wrapper--second'>
                                                <Text size='sm'>
                                                    <Localize i18n_default_text='Payout' />
                                                </Text>
                                                (
                                                {getTradeTypeName(contract_types[1], {
                                                    isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
                                                })}
                                                )
                                                <Text size='sm'>
                                                    {displayed_payout_2} {getCurrencyDisplayCode(currency)}
                                                </Text>
                                            </div>
                                        )}
                                    </>
                                )
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
