import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, Text, TextField, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getDecimalPlaces, getTradeTypeName, TRADE_TYPES } from '@deriv/shared';
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

const Stake = observer(({ is_minimized }: TStakeProps) => {
    const { amount, basis, contract_type, currency, onChange, trade_type_tab, trade_types, validation_errors } =
        useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [initial_stake_value, setInitialStakeValue] = React.useState<number>();
    const trade_types_array = Object.keys(trade_types).filter(
        type => !getTradeTypeTabsList(contract_type).length || type === trade_type_tab
    );

    // dummy payouts:
    const max_payout = 50000;
    const main_button_payout = 98.06;
    const second_button_payout = 97.25;

    React.useEffect(() => {
        setInitialStakeValue(amount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        if (basis === BASIS.PAYOUT) onChange({ target: { name: 'basis', value: BASIS.STAKE } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);

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
                                message={validation_errors?.amount[0]}
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
                            <div className='barrier-params__max-payout-wrapper'>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Max payout' />
                                </Text>
                                <Text size='sm'>
                                    {FormatUtils.formatMoney(max_payout)} {getCurrencyDisplayCode(currency)}
                                </Text>
                            </div>
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
                                    {FormatUtils.formatMoney(main_button_payout)} {getCurrencyDisplayCode(currency)}
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
