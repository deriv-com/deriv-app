import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { CaptionText, Text, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';

type TLastDigitSelectorProps = {
    is_minimized?: boolean;
};

const display_array = [...Array(10).keys()]; // digits array [0 - 9]

const LastDigitPrediction = observer(({ is_minimized }: TLastDigitSelectorProps) => {
    const { digit_stats, last_digit, onChange } = useTraderStore();

    const handleLastDigitChange = (digit: number) => {
        onChange({ target: { name: 'last_digit', value: digit } });
    };

    if (is_minimized)
        return (
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Last digit prediction' />}
                value={last_digit}
                className={clsx('trade-params__option', 'trade-params__option--minimized')}
            />
        );
    return (
        <div className='last-digit-prediction'>
            <CaptionText size='sm' className='last-digit-prediction__title'>
                <Localize i18n_default_text='Last digit prediction' />
            </CaptionText>
            <div className='last-digit-prediction__selector'>
                {display_array.map(digit => {
                    const stats = digit_stats.length ? digit_stats[digit] : null;
                    const percentage = stats ? (stats * 100) / 1000 : null;
                    const display_percentage =
                        percentage && !isNaN(percentage) ? parseFloat(percentage.toFixed(1)) : null;
                    return (
                        <div key={digit} className={clsx('digit', last_digit === digit && 'digit--active')}>
                            <button onClick={() => handleLastDigitChange(digit)} name='last_digit'>
                                <Text size='xl'>{digit}</Text>
                            </button>
                            {!!display_percentage && (
                                <CaptionText size='sm' className='percentage'>
                                    {display_percentage}%
                                </CaptionText>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default LastDigitPrediction;
