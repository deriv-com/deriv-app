import React, { useState } from 'react';
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
const BarrierInput = observer(() => {
    const {
        barrier_1,
        barrier_2,
        barrier_count,
        barrier_pipsize,
        duration_unit,
        onChange,
        validation_errors,
        proposal_info,
        trade_types,
    } = useTraderStore();

    const [option, setOption] = useState(0);
    const handleOption = (index: number) => {
        setOption(index);
    };
    const handleOnChange = (e: { target: { name: string; value: unknown } }) => {
        if (option == 0) {
            e.target.value = `+${e.target.value};`;
        }
        onChange(e);
    };
    return (
        <ActionSheet.Content>
            <div className='barrier-params'>
                <div className='barrier-params__chips'>
                    {chips_options.map((item, index) => (
                        <Chip.Selectable key={index} onClick={() => handleOption(index)} selected={index == option}>
                            <Text size='sm'>{item.name}</Text>
                        </Chip.Selectable>
                    ))}
                </div>
                {option !== 2 ? (
                    <TextFieldAddon
                        fillAddonBorderColor='var(--semantic-color-slate-solid-surface-frame-mid)'
                        type='text'
                        name='barrier_1'
                        addonLabel={option == 0 ? '+' : '-'}
                        status={validation_errors?.barrier_1.length > 0 ? 'error' : 'neutral'}
                        value={barrier_1.replace('+', '')}
                        onChange={handleOnChange}
                        placeholder={localize('Distance to spot')}
                        variant='fill'
                        message={validation_errors?.barrier_1[0]}
                    />
                ) : (
                    <TextField name='barrier_1' type='text' placeholder={localize('Distance to spot')} variant='fill' />
                )}
                <div className='barrier-params__current-spot-wrapper'>
                    <Text size='sm'>
                        <Localize i18n_default_text='Current spot' />
                    </Text>
                    <Text size='sm'> 554.55</Text>
                </div>
            </div>
        </ActionSheet.Content>
    );
});

export default BarrierInput;
