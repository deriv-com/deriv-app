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
    const { traders_hub, client } = useStores();
    const { document_status } = client.authentication_status;
    const { is_eu_user } = traders_hub;

    return (
        <div
            className={classNames(className, 'currency-switcher-container', {
                'currency-switcher-container--has-interaction': has_interaction,
            })}
            {...props}
        >
            <div className='currency-switcher-container--left'>
                <CurrencyIcon icon={icon} size={32} className='currency-switcher__currency--icon' />
                <div
                    className={classNames(
                        'currency-switcher-container__content',
                        `currency-switcher-container--${document_status || 'failed' || 'pending' || 'default'}`
                    )}
                >
                    <div
                        className={classNames(
                            'currency-switcher-container__content--text',
                            `currency-switcher-container__content--text--${
                                document_status || 'failed' || 'pending' || 'default'
                            }`
                        )}
                    >
                        {title}
                    </div>
                    {children}
                </div>
            </div>
            <div className='currency-switcher-container--right'>
                {actions}
                {(has_interaction || is_eu_user) && (
                    <div className='currency-switcher-container__arrow'>
                        <Icon icon='IcChevronDownBold' />
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(CurrentSwitcherContainer);
