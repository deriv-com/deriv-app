import React from 'react';
import { Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TReactMouseEvent } from 'Types';

type TPercentageSelectorProps = {
    amount: number;
    currency: string;
    from_account?: string;
    getCalculatedAmount: (amount: string) => void;
    percentage: number;
    should_percentage_reset: boolean;
    to_account?: string;
};

type TCalculateAmountInputEvent = { target: { id: number } };

const PercentageSelector = ({
    amount,
    currency,
    from_account,
    getCalculatedAmount,
    percentage,
    should_percentage_reset,
    to_account,
}: TPercentageSelectorProps) => {
    const [selected_percentage, setSelectedPercentage] = React.useState<number | string>('0');

    React.useEffect(() => {
        if (should_percentage_reset) {
            for (let i = 1; i <= 4; i++) {
                const percentage_selector_block = document.getElementById(String(i));
                if (percentage_selector_block)
                    percentage_selector_block.style.backgroundColor = 'var(--general-section-1)';
            }
        }
    }, [should_percentage_reset]);

    React.useEffect(() => {
        setSelectedPercentage(percentage || 0);
    }, [percentage]);

    React.useEffect(() => {
        calculateAmount({ target: { id: 0 } }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from_account, to_account]);

    const calculateAmount = (e: TCalculateAmountInputEvent | TReactMouseEvent, percent: number) => {
        let new_percentage = percent;
        const is_percentage_selected = percent > 0 && percent <= selected_percentage;
        if (is_percentage_selected) new_percentage -= 25;

        setSelectedPercentage(new_percentage || 0);
        getCalculatedAmount((amount * (new_percentage / 100)).toFixed(getDecimalPlaces(currency)));

        for (let i = 1; i <= 4; i++) {
            const percentage_selector_block = document.getElementById(String(i));
            if (percentage_selector_block) {
                if (
                    i < (e as TCalculateAmountInputEvent).target.id ||
                    (i === +(e as TCalculateAmountInputEvent).target.id && !is_percentage_selected)
                ) {
                    percentage_selector_block.style.backgroundColor = 'var(--status-success)';
                } else {
                    percentage_selector_block.style.backgroundColor = 'var(--general-section-1)';
                }
            }
        }
    };
    const format_amount = formatMoney(currency, amount, true);
    const currency__display_code = getCurrencyDisplayCode(currency);
    return (
        <React.Fragment>
            <div className='percentage-selector' data-testid='dt_percentage_selector_id'>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs' className='percentage-selector__text'>
                        {'25%'}
                    </Text>
                    <div
                        id='1'
                        className='percentage-selector-block'
                        onClick={e => calculateAmount(e, 25)}
                        data-testid='dt_percentage_selector_block_id_1'
                    />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs' className='percentage-selector__text'>
                        {'50%'}
                    </Text>
                    <div
                        id='2'
                        className='percentage-selector-block'
                        onClick={e => calculateAmount(e, 50)}
                        data-testid='dt_percentage_selector_block_id_2'
                    />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs' className='percentage-selector__text'>
                        {'75%'}
                    </Text>
                    <div
                        id='3'
                        className='percentage-selector-block'
                        onClick={e => calculateAmount(e, 75)}
                        data-testid='dt_percentage_selector_block_id_3'
                    />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs' className='percentage-selector__text'>
                        <Localize i18n_default_text='All' />
                    </Text>
                    <div
                        id='4'
                        className='percentage-selector-block'
                        onClick={e => calculateAmount(e, 100)}
                        data-testid='dt_percentage_selector_block_id_4'
                    />
                </div>
            </div>
            <Text color='less-prominent' size='xxs' line_height='l' className='percentage-selector__text'>
                <Localize
                    i18n_default_text='{{selected_percentage}}% of available balance ({{format_amount}} {{currency__display_code}})'
                    values={{ selected_percentage, format_amount, currency__display_code }}
                />
            </Text>
        </React.Fragment>
    );
};

export default PercentageSelector;
