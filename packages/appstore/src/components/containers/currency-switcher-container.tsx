import React, { ReactNode } from 'react';
import classNames from 'classnames';
import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import './currency-switcher-container.scss';
import { Icon } from '@deriv/components';

type CurrentSwitcherContainerProps = {
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
    icon: Currency;
    title: ReactNode;
    is_interactable?: boolean;
};

const CurrentSwitcherContainer = ({
    actions,
    children,
    className,
    icon,
    title,
    is_interactable = false,
}: CurrentSwitcherContainerProps) => {
    return (
        <div className={classNames(className, 'currency-switcher-container')}>
            <CurrencyIcon icon={icon} size={32} />
            <div className='currency-switcher-container__content'>
                {title}
                {children}
            </div>
            {actions}
            {is_interactable && (
                <div className=''>
                    <Icon icon='' />
                </div>
            )}
        </div>
    );
};

export default CurrentSwitcherContainer;
