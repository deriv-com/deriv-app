import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import TakeProfitHeader from './take-profit-header';

type TTakeProfitProps = {
    is_minimized?: boolean;
};

//TODO: validation, max and min allow values
//TODO: block "-" icon when value is 0

const TakeProfit = observer(({ is_minimized }: TTakeProfitProps) => {
    const { currency, has_open_accu_contract, has_take_profit, take_profit, onChangeMultiple, onChange } =
        useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    const [is_take_profit_enabled, setIsTakeProfitEnabled] = React.useState(has_take_profit);
    const [updated_take_profit_value, setUpdatedTakeProfitValue] = React.useState<string | number | undefined>(
        take_profit
    );
    const [error_message, setErrorMessage] = React.useState('');

    const input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const onToggleSwitch = (is_enabled: boolean) => {
        setIsTakeProfitEnabled(is_enabled);

        if (is_enabled) {
            clearTimeout(focus_timeout.current);
            focus_timeout.current = setTimeout(() => {
                input_ref.current?.focus();
                input_ref.current?.setSelectionRange(0, 9999);
            }, 150);
        } else {
            input_ref.current?.blur();
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { value } = e.target;
        if (Number(value) <= 0) value = '0';
        setUpdatedTakeProfitValue(value);
    };

    const onInputClick = () => {
        //TODO
    };

    const onSave = () => {
        onChangeMultiple({
            has_take_profit: is_take_profit_enabled,
            ...(is_take_profit_enabled ? { has_cancellation: false } : {}),
        });
        onChange({
            target: {
                name: 'take_profit',
                value: updated_take_profit_value,
            },
        });
        onActionSheetClose();
    };

    const onActionSheetClose = () => {
        setIsOpen(false);
        setIsTakeProfitEnabled(has_take_profit);
        setUpdatedTakeProfitValue(take_profit);
    };

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <React.Fragment>
                    <ActionSheet.Content className='take-profit__wrapper'>
                        <div className='take-profit__content'>
                            <Text>
                                <Localize i18n_default_text='Take profit' />
                            </Text>
                            <ToggleSwitch checked={is_take_profit_enabled} onChange={onToggleSwitch} />
                        </div>
                        <TextFieldWithSteppers
                            allowDecimals
                            disabled={!is_take_profit_enabled}
                            message={error_message}
                            name='take_profit'
                            onChange={onInputChange}
                            onClick={onInputClick}
                            placeholder={localize('Amount')}
                            ref={input_ref}
                            status={error_message ? 'error' : 'neutral'}
                            textAlignment='center'
                            unitLeft={currency}
                            variant='fill'
                            value={updated_take_profit_value}
                            // decimals={0}
                        />
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        primaryAction={{
                            content: <Localize i18n_default_text='Save' />,
                            onAction: onSave,
                        }}
                    />
                </React.Fragment>
            ),
        },
        {
            id: 2,
            component: (
                <ActionSheet.Content className='take-profit__wrapper--definition'>
                    <div className='take-profit__content'>
                        <Text>
                            <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
                        </Text>
                    </div>
                </ActionSheet.Content>
            ),
        },
    ];

    React.useEffect(() => {
        setIsTakeProfitEnabled(has_take_profit);
        setUpdatedTakeProfitValue(take_profit);

        return () => clearTimeout(focus_timeout.current);
    }, [has_take_profit, take_profit]);

    return (
        <React.Fragment>
            <TextField
                variant='fill'
                readOnly
                label={
                    <Localize i18n_default_text='Take profit' key={`take-profit${is_minimized ? '-minimized' : ''}`} />
                }
                value={take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                disabled={has_open_accu_contract}
                onClick={() => setIsOpen(true)}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onActionSheetClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel header={TakeProfitHeader} pages={action_sheet_content} />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default TakeProfit;
