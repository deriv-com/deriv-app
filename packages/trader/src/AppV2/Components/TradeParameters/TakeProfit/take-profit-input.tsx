import React from 'react';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

type TTakeProfitInputProps = {
    currency?: string;
    decimals?: number;
    error_message?: React.ReactNode;
    is_enabled?: boolean;
    is_accumulator?: boolean;
    message?: React.ReactNode;
    onToggleSwitch: (new_value: boolean) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    take_profit_value?: string | number;
};

const TakeProfitInput = React.forwardRef(
    (
        {
            currency,
            decimals,
            error_message,
            is_enabled,
            is_accumulator,
            message,
            onToggleSwitch,
            onInputChange,
            onSave,
            take_profit_value,
        }: TTakeProfitInputProps,
        ref: React.ForwardedRef<HTMLInputElement>
    ) => {
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
                        message={message}
                        name='take_profit'
                        onChange={onInputChange}
                        placeholder={localize('Amount')}
                        ref={ref}
                        status={error_message ? 'error' : 'neutral'}
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
