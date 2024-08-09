import React from 'react';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

type TTakeProfitInputProps = {
    currency?: string;
    decimals?: number;
    is_enabled?: boolean;
    is_accumulator?: boolean;
    message?: React.ReactNode;
    onToggleSwitch: (new_value: boolean) => void;
    onChangeMultiple: (prop: { has_take_profit?: boolean; has_cancellation?: false }) => Promise<void>;
    onChange: (e: {
        target: {
            name: string;
            value: unknown;
        };
    }) => Promise<void>;
    onActionSheetClose: () => void;
    take_profit_value?: string | number;
    validation_error?: string;
};

const TakeProfitInput = React.forwardRef(
    (
        {
            currency,
            decimals,
            is_enabled,
            is_accumulator,
            message,
            onToggleSwitch,
            onChangeMultiple,
            onChange,
            onActionSheetClose,
            take_profit_value,
            validation_error,
        }: TTakeProfitInputProps,
        ref: React.ForwardedRef<HTMLInputElement>
    ) => {
        const initial_value_ref = React.useRef<string | number>();
        const selected_value_ref = React.useRef<string | number | undefined>(take_profit_value);

        const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //TODO: check if we will need all this logic with latest Quill update. Add disabling "-" icon when value is < 1
            let value: string | number = e.target.value;
            value = String(value).trim().replace(',', '.');

            if (value !== '' && Number(value) <= 0) value = '0';
            if (value === selected_value_ref.current) return;
            selected_value_ref.current = value;

            onChange({
                target: {
                    name: 'take_profit',
                    value,
                },
            });
        };
        //TODO: togglechange and onChangeMultiple
        const onSave = () => {
            if (validation_error && is_enabled) {
                return;
            }

            if (selected_value_ref.current !== initial_value_ref.current) {
                initial_value_ref.current = selected_value_ref.current;
            }

            onChangeMultiple({
                has_take_profit: is_enabled,
                ...(is_enabled ? { has_cancellation: false } : {}),
            });

            onActionSheetClose();
        };

        React.useEffect(() => {
            if (!initial_value_ref.current && take_profit_value) {
                initial_value_ref.current = take_profit_value;
            }

            return () => {
                if (initial_value_ref.current !== selected_value_ref.current) {
                    onChange({ target: { name: 'take_profit', value: initial_value_ref.current } });
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <React.Fragment>
                <ActionSheet.Content className='take-profit__wrapper'>
                    <div className='take-profit__content'>
                        <Text>
                            <Localize i18n_default_text='Take profit' />
                        </Text>
                        <ToggleSwitch checked={is_enabled} onChange={onToggleSwitch} />
                    </div>
                    <TextFieldWithSteppers
                        allowDecimals
                        disabled={!is_enabled}
                        decimals={decimals}
                        inputMode='decimal'
                        message={validation_error || message}
                        name='take_profit'
                        onChange={onInputChange}
                        placeholder={localize('Amount')}
                        ref={ref}
                        status={validation_error ? 'error' : 'neutral'}
                        textAlignment='center'
                        unitLeft={currency}
                        variant='fill'
                        value={take_profit_value}
                    />
                    {!is_enabled && (
                        <button
                            className='take-profit__overlay'
                            onClick={() => onToggleSwitch(true)}
                            data-testid='dt_take_profit_overlay'
                        />
                    )}
                    {is_accumulator && (
                        <CaptionText color='quill-typography__color--subtle' className='take-profit__accu-information'>
                            <Localize i18n_default_text='Note: Cannot be adjusted for ongoing accumulator contracts.' />
                        </CaptionText>
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
        );
    }
);

TakeProfitInput.displayName = 'TakeProfitInput';

export default TakeProfitInput;
