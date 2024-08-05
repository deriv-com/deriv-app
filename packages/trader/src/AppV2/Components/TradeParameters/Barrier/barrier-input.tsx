import React from 'react';
import { ActionSheet, Chip, Text, TextField, TextFieldAddon } from '@deriv-com/quill-ui';

import { localize, Localize } from '@deriv/translations';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';

const chips_options = [
    {
        name: <Localize i18n_default_text='Above spot' />,
    },
    {
        name: <Localize i18n_default_text='Below spot' />,
    },
    {
        name: <Localize i18n_default_text='Fixed price' />,
    },
];
const BarrierInput = observer(({ setInitialBarrierValue }: { setInitialBarrierValue: (val: string) => void }) => {
    const { barrier_1, onChange, validation_errors, proposal_info } = useTraderStore();
    const [option, setOption] = React.useState(0);

    const proposal = Object.values(proposal_info);
    const spotPrice = proposal.length > 0 ? proposal[0].spot : '';

    React.useEffect(() => {
        setInitialBarrierValue(barrier_1);
        if (barrier_1.includes('-')) {
            setOption(1);
        } else if (barrier_1.includes('+')) {
            setOption(0);
        } else {
            setOption(2);
        }
    }, [setInitialBarrierValue]);

    const handleChipSelect = (index: number) => {
        setOption(index);
        let newValue = barrier_1.replace(/^[+-]/, '');

        if (index === 0) {
            newValue = `+${newValue}`;
        } else if (index === 1) {
            newValue = `-${newValue}`;
        }

        if ((newValue.startsWith('+') || newValue.startsWith('-')) && newValue.charAt(1) === '.') {
            newValue = `${newValue.charAt(0)}0${newValue.slice(1)}`;
        } else if (newValue.startsWith('.')) {
            newValue = `0${newValue}`;
        }

        onChange({ target: { name: 'barrier_1', value: newValue } });
    };

    const handleOnChange = (e: { target: { name: string; value: unknown } }) => {
        let value = e.target.value;
        if (option === 0) value = `+${value}`;
        if (option === 1) value = `-${value}`;
        onChange({ target: { name: 'barrier_1', value } });
    };

    return (
        <ActionSheet.Content>
            <div className='barrier-params'>
                <div className='barrier-params__chips'>
                    {chips_options.map((item, index) => (
                        <Chip.Selectable key={index} onClick={() => handleChipSelect(index)} selected={index == option}>
                            <Text size='sm'>{item.name}</Text>
                        </Chip.Selectable>
                    ))}
                </div>
                {option !== 2 ? (
                    <TextFieldAddon
                        fillAddonBorderColor='var(--semantic-color-slate-solid-surface-frame-mid)'
                        type='number'
                        name='barrier_1'
                        addonLabel={option == 0 ? '+' : '-'}
                        value={barrier_1.replace(/[+-]/g, '')}
                        allowDecimals
                        allowSign={false}
                        status={validation_errors?.barrier_1.length > 0 ? 'error' : 'neutral'}
                        onChange={handleOnChange}
                        placeholder={localize('Distance to spot')}
                        variant='fill'
                        message={validation_errors?.barrier_1[0]}
                    />
                ) : (
                    <TextField
                        type='number'
                        name='barrier_1'
                        status={validation_errors?.barrier_1.length > 0 ? 'error' : 'neutral'}
                        value={barrier_1}
                        allowDecimals
                        allowSign={false}
                        onChange={handleOnChange}
                        placeholder={localize('Distance to spot')}
                        variant='fill'
                        message={validation_errors?.barrier_1[0]}
                    />
                )}
                <div className='barrier-params__current-spot-wrapper'>
                    <Text size='sm'>
                        <Localize i18n_default_text='Current spot' />
                    </Text>
                    <Text size='sm'> {spotPrice}</Text>
                </div>
            </div>
        </ActionSheet.Content>
    );
});

export default BarrierInput;
