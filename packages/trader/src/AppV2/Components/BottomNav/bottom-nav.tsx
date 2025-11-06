import React from 'react';
import classNames from 'classnames';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import {
    StandaloneChartAreaFillIcon,
    StandaloneChartAreaRegularIcon,
    StandaloneClockThreeFillIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import { Navigation, Text } from '@deriv-com/quill-ui';
import { useStore } from '@deriv/stores';
import { useHistory, useLocation } from 'react-router';

type BottomNavProps = {
    children: React.ReactNode;
    className?: string;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
};

const BottomNav = observer(({ children, className, onScroll }: BottomNavProps) => {
    const history = useHistory();
    const location = useLocation();
    const { client, portfolio } = useStore();
    const { active_positions_count } = portfolio;
    const { is_logged_in } = client;

    const bottomNavItems = [
        {
            icon: <StandaloneChartAreaRegularIcon iconSize='sm' fill='var(--component-navigationBar-icon-default)' />,
            activeIcon: (
                <StandaloneChartAreaFillIcon iconSize='sm' fill='var(--component-navigationBar-icon-selected)' />
            ),
            label: <Localize i18n_default_text='Trade' />,
            path: routes.trade,
        },
        {
            icon: <StandaloneClockThreeRegularIcon iconSize='sm' fill='var(--component-navigationBar-icon-default)' />,
            activeIcon: (
                <StandaloneClockThreeFillIcon iconSize='sm' fill='var(--component-navigationBar-icon-selected)' />
            ),
            badge: active_positions_count > 0 ? active_positions_count.toString() : undefined,
            label: (
                <React.Fragment>
                    <span className='user-guide__anchor' />
                    <Localize i18n_default_text='Positions' />
                </React.Fragment>
            ),
            path: routes.trader_positions,
        },
    ];

    const navIndex = bottomNavItems.findIndex(item => item.path === location.pathname);
    const [selectedIndex, setSelectedIndex] = React.useState(navIndex > -1 ? navIndex : 0);

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        history.push(bottomNavItems[index].path);
    };

    return (
        <div className={classNames('bottom-nav', className)}>
            <div className='bottom-nav-selection' onScroll={onScroll}>
                {children}
            </div>
            {is_logged_in ? (
                <Navigation.Bottom onChange={(_, index) => handleSelect(index)} value={selectedIndex}>
                    {bottomNavItems.map((item, index) => (
                        <Navigation.BottomAction
                            key={index}
                            index={index}
                            badge={item.badge}
                            activeIcon={item.activeIcon}
                            icon={item.icon}
                            label={item.label}
                            selected={index === selectedIndex}
                            showLabel
                            className={clsx(
                                'bottom-nav-item',
                                item.path === routes.trader_positions && 'bottom-nav-item--positions'
                            )}
                        />
                    ))}
                </Navigation.Bottom>
            ) : (
                <></>
            )}
        </div>
    );
});

export default BottomNav;
