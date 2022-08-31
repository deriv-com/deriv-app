import React, { useState } from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const defaultProps = {
    is_title_enabled: true,
};

type TRadioButtonGroup = {
    label: string;
    className: string;
    children: React.ReactElement;
    is_fiat: boolean;
    item_count: number;
    description: React.ReactNode;
    has_fiat: boolean;
} & typeof defaultProps;

const RadioButtonGroup = ({
    label,
    className,
    children,
    is_title_enabled,
    is_fiat,
    item_count,
    description,
    has_fiat,
}: Partial<TRadioButtonGroup>) => {
    const [is_currency_selected, setIsCurrencySelected] = useState<boolean>(false);

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
                    'currency-list__items__center': item_count && item_count < 4,
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

RadioButtonGroup.defaultProps = defaultProps;

export default RadioButtonGroup;
