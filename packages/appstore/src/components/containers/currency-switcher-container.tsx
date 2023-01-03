import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import './currency-switcher-container.scss';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';

interface CurrentSwitcherContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    actions?: ReactNode;
    has_interaction?: boolean;
    icon: Currency;
    title: ReactNode;
}

const CurrentSwitcherContainer = ({
    actions,
    children,
    className,
    has_interaction = false,
    icon,
    title,
    ...props
}: CurrentSwitcherContainerProps) => {
    const { traders_hub } = useStores();
    const { is_eu_user } = traders_hub;
    return (
        <div
            className={classNames(className, 'currency-switcher-container', {
                'currency-switcher-container--has-interaction': has_interaction,
                'currency-switcher-container--eu-user': is_eu_user,
            })}
            {...props}
        >
            <CurrencyIcon icon={icon} size={32} />
            <div className='currency-switcher-container__content'>
                {title}
                {children}
            </div>
            {actions}
            {has_interaction && !is_eu_user && (
                <div className='currency-switcher-container__arrow'>
                    <Icon icon='IcChevronDownBold' />
                </div>
            )}
        </div>
    );
};

export default observer(CurrentSwitcherContainer);
