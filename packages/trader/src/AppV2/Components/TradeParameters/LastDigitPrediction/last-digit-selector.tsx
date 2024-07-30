import React from 'react';
import Digit from './digit';

type TLastDigitSelectorProps = {
    digits: number[];
    digit_stats: number[];
    is_stats_mode?: boolean;
    onDigitSelect?: (digit: number) => void;
    selected_digit?: number;
};

const LastDigitSelector = ({
    digits = [],
    digit_stats,
    is_stats_mode,
    onDigitSelect,
    selected_digit,
}: TLastDigitSelectorProps) => (
    <div className='last-digit-prediction__selector'>
        {[...Array(2).keys()].map(row_key => (
            <div key={row_key} className='last-digit-prediction__selector-row'>
                {digits.slice(row_key * 5, (row_key + 1) * 5).map(digit => (
                    <Digit
                        key={digit}
                        digit={digit}
                        digit_stats={digit_stats}
                        is_active={!is_stats_mode && selected_digit === digit}
                        is_disabled={is_stats_mode}
                        is_max={digit_stats[digit] === Math.max(...digit_stats)}
                        is_min={digit_stats[digit] === Math.min(...digit_stats)}
                        onClick={onDigitSelect}
                    />
                ))}
            </div>
        ))}
    </div>
);

export default LastDigitSelector;
