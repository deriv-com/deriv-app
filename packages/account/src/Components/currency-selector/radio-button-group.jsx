import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';

const RadioButtonGroup = ({ label, className, children, is_title_enabled, is_fiat, item_count }) => {
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
            <div
                className={classNames('currency-list__items', {
                    'currency-list__items__center': item_count < 4,
                    'currency-list__items__is-fiat': is_fiat,
                    'currency-list__items__is-crypto': !is_fiat,
                })}
            >
                {children}
            </div>
            {is_fiat && (
                <p className='currency-selector__description'>
                    <Localize i18n_default_text='You will not be able to change currency once you have made a deposit' />
                </p>
            )}
        </div>
    );
};

RadioButtonGroup.defaultProps = {
    is_title_enabled: true,
};

export default RadioButtonGroup;
