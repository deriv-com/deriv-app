import React, { AllHTMLAttributes, Fragment, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Popover, Icon } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { TReactElement } from 'Types';

type TUSTPopoverProps = {
    id: string;
};

interface TRadioButtonProps extends AllHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    field: InputHTMLAttributes<HTMLInputElement>;
    icon: string;
    second_line_label: string;
}

const USTPopover = ({ id }: TUSTPopoverProps) => {
    let popover_message: TReactElement | undefined;
    if (/^UST$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an Omni token (USDT) is a version of Tether that is hosted on the Omni layer on the Bitcoin blockchain.'
                }
                components={[<br key={0} />]}
            />
        );
    } else if (/^tUSDT$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={'Tether as a TRC20 token (tUSDT) is a version of Tether that is hosted on Tron.'}
            />
        );
    } else {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an ERC20 token (eUSDT) is a version of Tether that is hosted on Ethereum.'
                }
            />
        );
    }

    return (
        <Popover
            alignment='top'
            className='currency-list__popover'
            disable_message_icon
            icon='info'
            is_bubble_hover_enabled
            message={popover_message}
            zIndex={9999}
        />
    );
};

const RadioButton = ({
    field: { name, value, onChange, onBlur },
    icon,
    id,
    label,
    second_line_label,
    onClick,
    ...props
}: TRadioButtonProps) => {
    return (
        <Fragment>
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
                onClick={onClick}
            >
                {icon ? (
                    <Fragment>
                        <Icon className='currency-list__icon' icon={icon} />
                        <div className='label currency-list__item-text'>
                            <div className='currency-list__item-label'>{label}</div>
                            <div className='currency-list__item-code'>{second_line_label}</div>
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Icon className='currency-list__icon' icon={`IcCurrency-${id?.toLowerCase()}`} />
                        {id && /^(UST|eUSDT|tUSDT)$/i.test(id) && <USTPopover id={id} />}
                        <div className='label currency-list__item-text'>
                            <div className='currency-list__item-label'>{label}</div>
                            <div className='currency-list__item-code'>({getCurrencyDisplayCode(id)})</div>
                        </div>
                    </Fragment>
                )}
            </label>
        </Fragment>
    );
};

export default RadioButton;
