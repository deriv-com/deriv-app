import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, Text, TextField, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import {
    getContractTypePosition,
    getCurrencyDisplayCode,
    getDecimalPlaces,
    getTradeTypeName,
    TRADE_TYPES,
} from '@deriv/shared';
import { FormatUtils } from '@deriv-com/utils';
import { useTraderStore } from 'Stores/useTraderStores';
import { getTradeTypeTabsList } from 'AppV2/Utils/trade-params-utils';

type TStakeProps = {
    is_minimized?: boolean;
};

const BASIS = {
    PAYOUT: 'payout',
    STAKE: 'stake',
};

const getSortedIndex = (type: string, index?: number) => {
    switch (getContractTypePosition(type as 'CALL')) {
        case 'top':
            return 0;
        case 'bottom':
            return 1;
        default:
            return index;
    }
};

const Stake = observer(({ is_minimized }: TStakeProps) => {
    const {
        amount,
        basis,
        commission,
        contract_type,
        currency,
        is_multiplier,
        onChange,
        proposal_info,
        stop_out,
        trade_type_tab,
        trade_types,
        validation_errors,
        validation_params,
    } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [initial_stake_value, setInitialStakeValue] = React.useState<number>();
    const trade_types_array = Object.keys(trade_types)
        .filter(type => !getTradeTypeTabsList(contract_type).length || type === trade_type_tab)
        .sort((a, b) => Number(getSortedIndex(a) ?? 0) - Number(getSortedIndex(b) ?? 0));

    // TODO: use local state to not hide info upon proposal error
    const min_stake = Number(validation_params[trade_types_array[0]]?.stake?.min ?? 0);
    const max_stake = Number(validation_params[trade_types_array[0]]?.stake?.max ?? 0);
    const max_payout = Number(validation_params[trade_types_array[0]]?.max_payout ?? 0);
    const main_button_payout = Number(proposal_info[trade_types_array[0]]?.payout ?? 0);
    const second_button_payout = Number(proposal_info[trade_types_array[1]]?.payout ?? 0);
    const mult_content = [
        {
            label: <Localize i18n_default_text='Commission' />,
            value: commission,
        },
        {
            label: <Localize i18n_default_text='Stop out' />,
            value: stop_out,
        },
    ];

    React.useEffect(() => {
        setInitialStakeValue(amount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        if (basis === BASIS.PAYOUT) onChange({ target: { name: 'basis', value: BASIS.STAKE } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);

    const getInputMessage = () =>
        validation_errors?.amount[0] ||
        (min_stake && max_stake && (
            <Localize
                i18n_default_text='Acceptable range: {{min_stake}} to {{max_stake}} {{currency}}'
                values={{
                    currency: getCurrencyDisplayCode(currency),
                    min_stake: FormatUtils.formatMoney(min_stake),
                    max_stake: FormatUtils.formatMoney(max_stake),
                }}
            />
        ));

    const handleOnChange = (e: { target: { name: string; value: string } }) => {
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
                                status={validation_errors?.amount.length > 0 ? 'error' : 'neutral'}
                                textAlignment='center'
                                inputMode='decimal'
                                unitLeft={getCurrencyDisplayCode(currency)}
                                variant='fill'
                                value={amount}
                            />
                            {!!max_payout && !is_multiplier && (
                                <div className='barrier-params__max-payout-wrapper'>
                                    <Text size='sm'>
                                        <Localize i18n_default_text='Max payout' />
                                    </Text>
                                    <Text size='sm'>
                                        {FormatUtils.formatMoney(max_payout)} {getCurrencyDisplayCode(currency)}
                                    </Text>
                                </div>
                            )}
                            {main_button_payout ? (
                                <>
                                    <div className='barrier-params__button-payout-wrapper'>
                                        <Text size='sm'>
                                            <Localize i18n_default_text='Payout' />
                                        </Text>
                                        (
                                        {getTradeTypeName(trade_types_array[0], {
                                            isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
                                        })}
                                        )
                                        <Text size='sm'>
                                            {FormatUtils.formatMoney(main_button_payout)}{' '}
                                            {getCurrencyDisplayCode(currency)}
                                        </Text>
                                    </div>
                                    {trade_types_array.length > 1 && (
                                        <div className='barrier-params__button-payout-wrapper--second'>
                                            <Text size='sm'>
                                                <Localize i18n_default_text='Payout' />
                                            </Text>
                                            (
                                            {getTradeTypeName(trade_types_array[1], {
                                                isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
                                            })}
                                            )
                                            <Text size='sm'>
                                                {FormatUtils.formatMoney(second_button_payout)}{' '}
                                                {getCurrencyDisplayCode(currency)}
                                            </Text>
                                        </div>
                                    )}
                                </>
                            ) : (
                                is_multiplier && (
                                    <div className='multipliers-info__wrapper'>
                                        {mult_content.map(({ label, value }) => (
                                            <div key={label.props.i18n_default_text} className='multipliers-info__row'>
                                                <Text size='sm' className='multipliers-info__title'>
                                                    {label}
                                                </Text>
                                                <Text size='sm' bold>
                                                    {FormatUtils.formatMoney(Number(value))}{' '}
                                                    {getCurrencyDisplayCode(currency)}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
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
                                if (validation_errors.amount.length === 0) {
                                    onClose(true);
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
