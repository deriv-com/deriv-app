import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import React, { ReactNode } from 'react';
import './static-currency-switcher-container.scss';

type CurrentSwitcherContainerProps = {
    children: ReactNode;
    icon: Currency;
    title: ReactNode;
};

const StaticCurrencySwitcherContainer = ({ children, icon, title }: CurrentSwitcherContainerProps) => {
    return (
        <div className='currency-switcher-container'>
            <CurrencyIcon icon={icon} size={32} />
            <div className='currency-switcher-container__content'>
                {title}
                {children}
            </div>
        </div>
    );
};

export default StaticCurrencySwitcherContainer;
