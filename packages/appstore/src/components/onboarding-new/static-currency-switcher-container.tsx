import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import './static-currency-switcher-container.scss';
import { Icon } from '@deriv/components';
import CurrencyIcon from 'Components/currency';

type CurrentSwitcherContainerProps = {
    actions?: ReactNode;
    children: ReactNode;
    icon: React.ComponentProps<typeof CurrencyIcon>['icon'];
    title: ReactNode;
};

const StaticCurrencySwitcherContainer = ({ children, icon, title, actions }: CurrentSwitcherContainerProps) => {
    const { traders_hub } = useStores();
    const { is_eu_user } = traders_hub;
    return (
        <div
            className={classNames('static-currency-switcher-container', {
                'static-currency-switcher-container--eu-user': is_eu_user,
            })}
        >
            <CurrencyIcon icon={icon} size={32} />
            <div className='static-currency-switcher-container__content'>
                {title}
                {children}
            </div>
            <div className='currency-switcher-container--right'>
                {actions}
                <div className='currency-switcher-container__arrow--onboarding'>
                    <Icon icon='IcChevronDownBold' />
                </div>
            </div>
        </div>
    );
};

export default observer(StaticCurrencySwitcherContainer);
