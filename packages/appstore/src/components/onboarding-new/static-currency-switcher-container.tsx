import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import './static-currency-switcher-container.scss';

type CurrentSwitcherContainerProps = {
    actions?: ReactNode;
    children: ReactNode;
    icon: Currency;
    title: ReactNode;
};

const StaticCurrencySwitcherContainer = ({ children, icon, title, actions }: CurrentSwitcherContainerProps) => {
    const { traders_hub } = useStores();
    const { is_eu_user } = traders_hub;
    return (
        <div
            className={classNames('currency-switcher-container', {
                'currency-switcher-container--eu-user': is_eu_user,
            })}
        >
            <CurrencyIcon icon={icon} size={32} />
            <div className='currency-switcher-container__content'>
                {title}
                {children}
            </div>
            {actions}
        </div>
    );
};

export default observer(StaticCurrencySwitcherContainer);
