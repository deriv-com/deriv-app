import React from 'react';
import clsx from 'clsx';
import { CaptionText, Text, Skeleton } from '@deriv-com/quill-ui';

type TDigitsProps = {
    is_active?: boolean;
    is_disabled?: boolean;
    is_max?: boolean;
    is_min?: boolean;
    digit: number;
    digit_stats: number[];
    onClick?: (digit: number) => void;
};

const Digit = ({ digit, digit_stats = [], is_active, is_disabled, is_max, is_min, onClick }: TDigitsProps) => {
    const stats = digit_stats.length ? digit_stats[digit] : null;
    const percentage = stats ? (stats * 100) / 1000 : null;
    const display_percentage = percentage && !isNaN(percentage) ? parseFloat(percentage.toFixed(1)) : null;

    if (!digit && isNaN(digit)) return null;
    return (
        <div key={digit} className='digit'>
            <button
                className={clsx(is_active && 'active')}
                disabled={is_disabled}
                onClick={() => onClick?.(digit)}
                name='last_digit'
            >
                <Text size='xl' color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                    {digit}
                </Text>
            </button>
            {display_percentage ? (
                <CaptionText
                    size='sm'
                    className={clsx('percentage', is_max && 'percentage--max', is_min && 'percentage--min')}
                    data-testid='dt_digit_stats_percentage'
                >
                    {display_percentage}%
                </CaptionText>
            ) : (
                <Skeleton.Square width={36} height={18} rounded />
            )}
        </div>
    );
};

export default Digit;
