import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import React, { ReactNode } from 'react';
import './currency-switcher-container.scss';

type CurrentSwitcherContainerProps = {
    actions?: ReactNode;
    children: ReactNode;
    icon: Currency;
    title: ReactNode;
};

const CurrentSwitcherContainer = ({ actions, children, icon, title }: CurrentSwitcherContainerProps) => {
    return (
        <div className='currency-switcher-container'>
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
