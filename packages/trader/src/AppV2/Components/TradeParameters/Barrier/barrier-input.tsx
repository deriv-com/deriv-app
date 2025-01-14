import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Localize, localize } from '@deriv/translations';
import { ActionSheet, Chip, Text, TextField, TextFieldAddon } from '@deriv-com/quill-ui';

import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { ProposalResponse } from 'Stores/Modules/Trading/trade-store';
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
    ({ is_days, onClose, is_open }: { is_days: boolean; onClose: () => void; is_open: boolean }) => {
        const trade_store = useTraderStore();
        const { barrier_1, onChange, tick_data, trade_types } = trade_store;
        const [value, setValue] = useState(String(barrier_1.replace(/[+-]/g, '')));
        const [input_value, setInputValue] = useState<{ [key: string]: string }>({});
        const [option, setOption] = React.useState(0);
        const [should_show_error, setShouldShowError] = React.useState(false);
        const [is_focused, setIsFocused] = React.useState(false);
        const [is_processing, setIsProcessing] = React.useState(false);
        const { pip_size } = tick_data ?? {};
        const barrier_ref = React.useRef<HTMLInputElement | null>(null);
        const prefix = (option === 0 && '+') || (option === 1 && '-');
        const new_values = { barrier: `${prefix || ''}${value}` };
        const required_error = localize('Barrier is a required field.');

        const proposal_req = getProposalRequestObject({
            new_values,
            trade_store,
            trade_type: Object.keys(trade_types)[0],
        });

        const { data: response } = useDtraderQuery<ProposalResponse>(
            ['proposal', `${prefix || ''}${value}`],
            {
                ...proposal_req,
                ...new_values,
            },
            {
                enabled: (is_open && barrier_1 !== '') || is_processing,
            }
        );

        const show_hidden_error = Boolean(value && response?.error?.message);

        React.useEffect(() => {
            if (barrier_1.includes('-')) {
                setOption(1);
            } else if (barrier_1.includes('+')) {
                setOption(0);
            } else {
                setOption(2);
            }
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
            const input = { ...input_value, ...{ [option]: value } };
            setInputValue(input);
            // On each change have to check if its =,- as per the barrier_1. If yes , then set the value or else just don't
            // and make it empty
            setOption(index);
            setShouldShowError(false);
            const sign = barrier_1[0];
            if (input_value[index]) {
                setValue(input_value[index]);
            } else if (sign === '+' && index === 0) {
                setValue(barrier_1.replace(/[+-]/g, ''));
            } else if (sign === '-' && index === 1) {
                setValue(barrier_1.replace(/[+-]/g, ''));
            } else if (index === 2 && !['+', '-'].includes(sign)) {
                setValue(barrier_1);
            } else {
                setValue('');
            }
            setTimeout(() => {
                setIsProcessing(false);
            }, 0);
        };

        const getErrorMessage = () => {
            if (is_processing) {
                return '';
            }
            if (show_hidden_error) {
                return response?.error?.message;
            }
            if (should_show_error) {
                return required_error;
            }
            return '';
        };

        const handleOnChange = (e: { target: { name: string; value: string } }) => {
            let value = e.target.value;
            if (option === 0) value = `+${value}`;
            if (option === 1) value = `-${value}`;
            setValue(value.replace(/[+-]/g, ''));
        };

        return (
            <>
                <ActionSheet.Content>
                    <div className='barrier-params'>
                        {!is_days && (
                            <div className='barrier-params__chips'>
                                {chips_options.map((item, index) => (
                                    <Chip.Selectable
                                        key={index}
                                        onClick={() => {
                                            setIsProcessing(true);
                                            handleChipSelect(index);
                                        }}
                                        selected={index == option}
                                    >
                                        <Text size='sm'>{item.name}</Text>
                                    </Chip.Selectable>
                                ))}
                            </div>
                        )}

                        <div>
                            {option === 2 || is_days ? (
                                <TextField
                                    customType='commaRemoval'
                                    name='barrier_1'
                                    noStatusIcon
                                    status={show_hidden_error || should_show_error ? 'error' : 'neutral'}
                                    shouldRound={false}
                                    value={value}
                                    allowDecimals
                                    decimals={pip_size}
                                    allowSign={false}
                                    inputMode='decimal'
                                    regex={/[^0-9.,]/g}
                                    textAlignment='center'
                                    onChange={handleOnChange}
                                    placeholder={localize('Price')}
                                    variant='fill'
                                    message={getErrorMessage()}
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
                                    value={value}
                                    allowDecimals
                                    inputMode='decimal'
                                    allowSign={false}
                                    status={show_hidden_error || should_show_error ? 'error' : 'neutral'}
                                    shouldRound={false}
                                    onChange={handleOnChange}
                                    placeholder={localize('Distance to spot')}
                                    regex={/[^0-9.,]/g}
                                    variant='fill'
                                    message={getErrorMessage()}
                                    ref={barrier_ref}
                                />
                            )}
                            {!(show_hidden_error || should_show_error) && (
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
                            if (!show_hidden_error && value !== '') {
                                onChange({ target: { name: 'barrier_1', value: `${prefix || ''}${value}` } });
                                onClose();
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
