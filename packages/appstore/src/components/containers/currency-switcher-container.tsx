import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import './currency-switcher-container.scss';

interface CurrentSwitcherContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    actions?: ReactNode;
    icon: Currency;
    title: ReactNode;
}

const CurrentSwitcherContainer = ({
    actions,
    children,
    className,
    icon,
    title,
    ...props
}: CurrentSwitcherContainerProps) => {
    return (
        <div className={classNames(className, 'currency-switcher-container')} {...props}>
            <CurrencyIcon icon={icon} size={32} />
            <div className='currency-switcher-container__content'>
                {title}
                {children}
            </div>
            {actions}
        </div>
    );
};

export default CurrentSwitcherContainer;
