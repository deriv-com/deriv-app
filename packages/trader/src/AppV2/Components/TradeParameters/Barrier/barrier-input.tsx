import React from 'react';
import { ActionSheet, Chip, Text, TextField, TextFieldAddon } from '@deriv-com/quill-ui';

import { localize, Localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import { useTraderStore } from 'Stores/useTraderStores';

const chips_options = [
    {
        name: <Localize i18n_default_text='Above spot' />,
    },
    {
        name: <Localize i18n_default_text='Below spot' />,
    },
    {
        name: <Localize i18n_default_text='Fixed barrier' />,
    },
];
const BarrierInput = observer(
    ({
        setInitialBarrierValue,
        isDays,
        onClose,
    }: {
        setInitialBarrierValue: (val: string) => void;
        isDays: boolean;
        onClose: (val: boolean) => void;
    }) => {
        const { barrier_1, onChange, validation_errors, tick_data, setV2ParamsInitialValues } = useTraderStore();
        const [option, setOption] = React.useState(0);
        const [should_show_error, setShouldShowError] = React.useState(false);
        const [previous_value, setPreviousValue] = React.useState(barrier_1);
        const [is_focused, setIsFocused] = React.useState(false);
        const { pip_size } = tick_data ?? {};
        const barrier_ref = React.useRef<HTMLInputElement | null>(null);
        const show_hidden_error = validation_errors?.barrier_1.length > 0 && (barrier_1 || should_show_error);

        React.useEffect(() => {
            setInitialBarrierValue(barrier_1);
            setV2ParamsInitialValues({ name: 'barrier_1', value: barrier_1 });
            if (barrier_1.includes('-')) {
                setOption(1);
            } else if (barrier_1.includes('+')) {
                setOption(0);
            } else {
                setOption(2);
            }
            onChange({ target: { name: 'barrier_1', value: barrier_1 } });
        }, []);

        React.useEffect(() => {
            const barrier_element = barrier_ref.current;
            const checkFocus = () => {
                setIsFocused(!!(barrier_element && barrier_element.contains(document.activeElement)));
            };
            document.addEventListener('focusin', checkFocus);
            document.addEventListener('focusout', checkFocus);

            return () => {
                document.removeEventListener('focusin', checkFocus);
                document.removeEventListener('focusout', checkFocus);
            };
        });

        React.useEffect(() => {
            if (is_focused) {
                setShouldShowError(false);
            }
        }, [is_focused]);

        const handleChipSelect = (index: number) => {
            setOption(index);
            const current_value = barrier_1.replace(/^[+-]/, '');
            let newValue = previous_value.replace(/^[+-]/, '');

            if (index === 0) {
                newValue = `+${newValue}`;
            } else if (index === 1) {
                newValue = `-${newValue}`;
            } else if (index === 2) {
                newValue = '';
                setPreviousValue(current_value);
            }

            if ((newValue.startsWith('+') || newValue.startsWith('-')) && newValue.charAt(1) === '.') {
                newValue = `${newValue.charAt(0)}0${newValue.slice(1)}`;
            } else if (newValue.startsWith('.')) {
                newValue = `0${newValue}`;
            }

            onChange({ target: { name: 'barrier_1', value: newValue } });
        };

        const handleOnChange = (e: { target: { name: string; value: string } }) => {
            let value = e.target.value;
            if (option === 0) value = `+${value}`;
            if (option === 1) value = `-${value}`;
            onChange({ target: { name: 'barrier_1', value } });
            setV2ParamsInitialValues({ name: 'barrier_1', value });
            setPreviousValue(value);
        };

        return (
            <>
                <ActionSheet.Content>
                    <div className='barrier-params'>
                        {!isDays && (
                            <div className='barrier-params__chips'>
                                {chips_options.map((item, index) => (
                                    <Chip.Selectable
                                        key={index}
                                        onClick={() => handleChipSelect(index)}
                                        selected={index == option}
                                    >
                                        <Text size='sm'>{item.name}</Text>
                                    </Chip.Selectable>
                                ))}
                            </div>
                        )}

                        <div>
                            {option === 2 || isDays ? (
                                <TextField
                                    customType='commaRemoval'
                                    name='barrier_1'
                                    noStatusIcon
                                    status={show_hidden_error ? 'error' : 'neutral'}
                                    shouldRound={false}
                                    value={barrier_1}
                                    allowDecimals
                                    decimals={pip_size}
                                    allowSign={false}
                                    inputMode='decimal'
                                    regex={/[^0-9.,]/g}
                                    textAlignment='center'
                                    onChange={handleOnChange}
                                    placeholder={localize('Price')}
                                    variant='fill'
                                    message={show_hidden_error ? validation_errors?.barrier_1[0] : ''}
                                    ref={barrier_ref}
                                />
                            ) : (
                                <TextFieldAddon
                                    fillAddonBorderColor='var(--semantic-color-slate-solid-surface-frame-mid)'
                                    customType='commaRemoval'
                                    name='barrier_1'
                                    noStatusIcon
                                    addonLabel={option == 0 ? '+' : '-'}
                                    decimals={pip_size}
                                    value={barrier_1.replace(/[+-]/g, '')}
                                    allowDecimals
                                    inputMode='decimal'
                                    allowSign={false}
                                    status={show_hidden_error ? 'error' : 'neutral'}
                                    shouldRound={false}
                                    onChange={handleOnChange}
                                    placeholder={localize('Distance to spot')}
                                    regex={/[^0-9.,]/g}
                                    variant='fill'
                                    message={show_hidden_error ? validation_errors?.barrier_1[0] : ''}
                                    ref={barrier_ref}
                                />
                            )}
                            {(validation_errors?.barrier_1.length == 0 || !show_hidden_error) && (
                                <div className='barrier-params__error-area' />
                            )}
                        </div>
                        <div className='barrier-params__current-spot-wrapper'>
                            <Text size='sm'>
                                <Localize i18n_default_text='Current spot' />
                            </Text>
                            <Text size='sm'>{tick_data?.quote}</Text>
                        </div>
                    </div>
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    shouldCloseOnPrimaryButtonClick={false}
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction: () => {
                            if (validation_errors.barrier_1.length === 0) {
                                onClose(true);

                                // This is a workaround to re-trigger any validation errors that were hidden behind the action sheet
                                handleOnChange({
                                    target: { name: 'barrier_1', value: barrier_1.replace(/[+-]/g, '') },
                                });
                            } else {
                                setShouldShowError(true);
                            }
                        },
                    }}
                />
            </>
        );
    }
);

export default BarrierInput;
