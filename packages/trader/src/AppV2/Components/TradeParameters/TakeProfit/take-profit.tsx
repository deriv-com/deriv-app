import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, SectionMessage, TextField, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import TakeProfitHeader from './take-profit-header';

type TTakeProfitProps = {
    is_minimized?: boolean;
};

const TakeProfit = observer(({ is_minimized }: TTakeProfitProps) => {
    const {
        currency,
        has_open_accu_contract,
        has_take_profit,
        is_accumulator,
        take_profit,
        onChangeMultiple,
        onChange,
        validation_params,
    } = useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    const [is_take_profit_enabled, setIsTakeProfitEnabled] = React.useState(has_take_profit);
    const [updated_take_profit_value, setUpdatedTakeProfitValue] = React.useState<string | number | undefined>(
        take_profit
    );
    const [error_message, setErrorMessage] = React.useState<React.ReactNode>();

    const input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const min_take_profit = validation_params?.take_profit?.min;
    const max_take_profit = validation_params?.take_profit?.max;
    const decimals = getDecimalPlaces(currency);

    const getInputMessage = () =>
        is_take_profit_enabled
            ? error_message || (
                  <Localize
                      i18n_default_text='Acceptable range: {{min_take_profit}} to {{max_take_profit}} {{currency}}'
                      values={{ currency, min_take_profit, max_take_profit }}
                  />
              )
            : '';

    const isTakeProfitOutOfRange = (value = updated_take_profit_value) => {
        if (!value) {
            setErrorMessage(<Localize i18n_default_text='Please enter a take profit amount.' />);
            return true;
        }
        if (Number(value) < Number(min_take_profit) || Number(value) > Number(max_take_profit)) {
            setErrorMessage(
                <Localize
                    i18n_default_text='Acceptable range: {{min_take_profit}} to {{max_take_profit}} {{currency}}'
                    values={{ currency, min_take_profit, max_take_profit }}
                />
            );
            return true;
        }
        setErrorMessage('');
        return false;
    };

    function focusAndOpenKeyboard(el: HTMLInputElement | null) {
        if (el) {
            // Align temp input element approximately where the input element is
            // so the cursor doesn't jump around
            const tempEl = document.createElement('input');
            tempEl.style.position = 'absolute';
            tempEl.style.top = `${el.offsetTop + 7}px`;
            tempEl.style.left = `${el.offsetLeft}px`;
            tempEl.style.height = '0px';
            tempEl.style.opacity = '0px';
            // Put this temp element as a child of the page <body> and focus on it
            document.body.appendChild(tempEl);
            tempEl.focus();

            // The keyboard is open. Now do a delayed focus on the target element
            setTimeout(function () {
                el.focus();
                el.click();
                // Remove the temp element
                document.body.removeChild(tempEl);
            }, 300);
        }
    }

    const onToggleSwitch = (is_enabled: boolean) => {
        setIsTakeProfitEnabled(is_enabled);

        if (is_enabled) {
            if (updated_take_profit_value !== '' && updated_take_profit_value !== undefined) {
                isTakeProfitOutOfRange();
            }

            clearTimeout(focus_timeout.current);
            // focus_timeout.current = setTimeout(() => {
            // input_ref.current?.click();
            // input_ref.current?.focus();
            focusAndOpenKeyboard(input_ref.current);
            // }, 150);
        } else {
            input_ref.current?.blur();
            setErrorMessage('');
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //TODO: check if we will need all this logic when latest Quill update and block "-" icon when value is < 1
        let value: string | number = e.target.value;
        value = String(value).trim().replace(',', '.');

        if (value !== '' && Number(value) <= 0) value = '0';
        // value = parseFloat(Number(value).toFixed(decimals));
        setUpdatedTakeProfitValue(value);
        isTakeProfitOutOfRange(value);
    };

    const onSave = () => {
        if (isTakeProfitOutOfRange()) return;

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
                            decimals={decimals}
                            message={getInputMessage()}
                            name='take_profit'
                            onChange={onInputChange}
                            placeholder={localize('Amount')}
                            ref={input_ref}
                            status={error_message ? 'error' : 'neutral'}
                            textAlignment='center'
                            unitLeft={currency}
                            variant='fill'
                            value={updated_take_profit_value}
                        />
                        {!is_take_profit_enabled && (
                            <button className='take-profit__overlay' onClick={() => onToggleSwitch(true)} />
                        )}
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        primaryAction={{
                            content: <Localize i18n_default_text='Save' />,
                            onAction: onSave,
                        }}
                        shouldCloseOnPrimaryButtonClick={false}
                    />
                </React.Fragment>
            ),
        },
        {
            id: 2,
            component: (
                <ActionSheet.Content className='take-profit__wrapper--definition'>
                    <Text>
                        <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
                    </Text>
                    {is_accumulator && (
                        <SectionMessage
                            className='take-profit__warning'
                            message={
                                <Localize i18n_default_text="Take profit can't be adjusted for ongoing accumulator contracts." />
                            }
                            size='sm'
                            status='info'
                        />
                    )}
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
                value={has_take_profit && take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'}
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
