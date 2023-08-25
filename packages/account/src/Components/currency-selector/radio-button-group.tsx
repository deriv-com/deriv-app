import React, { useState } from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

export type TRadioButtonGroup = {
    className: string;
    is_fiat?: boolean;
    is_title_enabled?: boolean;
    item_count: number;
    label: string;
    description: React.ReactNode;
    has_fiat?: boolean;
};

const RadioButtonGroup = ({
    label,
    className,
    children,
    is_title_enabled = true,
    is_fiat,
    item_count,
    description,
    has_fiat,
}: React.PropsWithChildren<TRadioButtonGroup>) => {
    const [is_currency_selected, setIsCurrencySelected] = useState(false);

    const onCurrencyClicked = () => {
        setIsCurrencySelected(true);
    };
    return (
        <div className={className}>
            {is_title_enabled && (
                <h2
                    className={classNames(`${className}--is-header`, {
                        'currency-selector__is-crypto': !is_fiat,
                    })}
                >
                    {label}
                </h2>
            )}
            {is_fiat && has_fiat && (
                <Text size='xxs' className='currency-selector__subheading'>
                    {localize('You are limited to one fiat currency only')}
                </Text>
            )}
            <div
                className={classNames('currency-list__items', {
                    'currency-list__items__center': item_count < 4,
                    'currency-list__items__is-fiat': is_fiat,
                    'currency-list__items__is-crypto': !is_fiat,
                })}
                onClick={onCurrencyClicked}
            >
                {children}
            </div>
            {is_fiat && is_currency_selected && <p className='currency-selector__description'>{description}</p>}
        </div>
    );
};

export default RadioButtonGroup;
