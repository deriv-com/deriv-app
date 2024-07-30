import React from 'react';
import { ActionSheet, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import FocusedInput from 'AppV2/Components/FocusedInput';

type TTakeProfitInputProps = {
    currency?: string;
    decimals?: number;
    error_message?: React.ReactNode;
    is_enabled?: boolean;
    is_focused?: boolean;
    message?: React.ReactNode;
    onToggleSwitch: (new_value: boolean) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
    take_profit_value?: string | number;
};

const TakeProfitInput = ({
    currency,
    decimals,
    error_message,
    is_enabled,
    is_focused,
    message,
    onToggleSwitch,
    onInputChange,
    onSave,
    setIsFocused,
    take_profit_value,
}: TTakeProfitInputProps) => {
    const ref = React.useRef<HTMLInputElement>(null);

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
                {is_focused && <FocusedInput focused_ref={ref} setIsFocused={setIsFocused} />}
                {!is_enabled && (
                    <button
                        className='take-profit__overlay'
                        onClick={() => onToggleSwitch(true)}
                        data-testid='dt_take_profit_overlay'
                    />
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
};

export default TakeProfitInput;
