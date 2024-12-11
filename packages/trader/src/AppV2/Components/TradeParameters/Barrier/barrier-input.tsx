import React, { useState } from 'react';
import { ActionSheet, Chip, Text, TextField, TextFieldAddon } from '@deriv-com/quill-ui';

import { localize, Localize } from '@deriv/translations';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { ProposalResponse } from 'Stores/Modules/Trading/trade-store';

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
    ({ isDays, onClose, is_open }: { isDays: boolean; onClose: () => void; is_open: boolean }) => {
        const trade_store = useTraderStore();
        const { barrier_1, onChange, tick_data, trade_types } = trade_store;
        const [value, setValue] = useState(String(barrier_1.replace(/[+-]/g, '')));
        const [option, setOption] = React.useState(0);
        const { pip_size } = tick_data ?? {};
        const barrier_ref = React.useRef<HTMLInputElement | null>(null);
        const prefix = (option === 0 && '+') || (option === 1 && '-');
        const new_values = { barrier: `${prefix || ''}${value}` };

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
                enabled: is_open && barrier_1 !== '',
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

        const handleChipSelect = (index: number) => {
            // On each change have to check if its =,- as per the barrier_1. If yes , then set the value or else just don't
            // and make it empty
            setOption(index);
            const sign = barrier_1[0];

            if (sign == '+' && index == 0) {
                setValue(barrier_1.replace(/[+-]/g, ''));
            } else if (sign === '-' && index == 1) {
                setValue(barrier_1.replace(/[+-]/g, ''));
            } else if (index == 2 && !['+', '-'].includes(sign)) {
                setValue(barrier_1);
            } else {
                setValue('');
            }
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
                                    message={show_hidden_error ? response?.error?.message : ''}
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
                                    status={show_hidden_error ? 'error' : 'neutral'}
                                    shouldRound={false}
                                    onChange={handleOnChange}
                                    placeholder={localize('Distance to spot')}
                                    regex={/[^0-9.,]/g}
                                    variant='fill'
                                    message={show_hidden_error ? response?.error?.message : ''}
                                    ref={barrier_ref}
                                />
                            )}
                            {!show_hidden_error && <div className='barrier-params__error-area' />}
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
                            }
                        },
                    }}
                />
            </>
        );
    }
);

export default BarrierInput;
