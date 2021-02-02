import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Popover, Icon } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';

const USTPopover = ({ id }) => {
    let popover_message;
    if (/^UST$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether on Omnilayer (USDT) is a version of Tether, a digital token issued on blockchains and holds a value pegged to 1 USD at all times.<0 /><0 />USDT is built on the bitcoin blockchain via Omni Layer, a platform for digital assets and currencies that run in the bitcoin network.'
                }
                components={[<br key={0} />]}
            />
        );
    } else {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an ERC20 token (eUSDT) is a version of Tether that is hosted on Ethereum, an open software platform where anyone can build and deploy decentralised applications.'
                }
            />
        );
    }

    return (
        <Popover
            alignment='top'
            icon='info'
            disable_message_icon
            zIndex={9999}
            className='currency-list__popover'
            message={popover_message}
        />
    );
};

// Radio input
const RadioButton = ({ field: { name, value, onChange, onBlur }, id, label, className, ...props }) => {
    return (
        <React.Fragment>
            <input
                name={name}
                id={id}
                type='radio'
                value={id} // could be something else for output?
                checked={id === value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={props.selected}
                className={classNames('currency-list__radio-button')}
                {...props}
            />
            <label
                htmlFor={id}
                className={classNames('currency-list__item', {
                    'currency-list__item--selected': id === value,
                    'currency-list__item--current': props.selected,
                })}
            >
                <div>
                    <Icon className='currency-list__icon' icon={`IcCurrency-${id.toLowerCase()}`} />
                    {/^(UST|eUSDT)$/i.test(id) && <USTPopover id={id} />}
                    <div className='label currency-list__item-text'>
                        <div className='currency-list__item-label'>{label}</div>
                        <div className='currency-list__item-code'>({getCurrencyDisplayCode(id)})</div>
                    </div>
                </div>
            </label>
        </React.Fragment>
    );
};

export default RadioButton;
