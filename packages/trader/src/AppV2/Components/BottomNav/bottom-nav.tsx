import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import {
    LegacyMarketBasketIndicesIcon,
    StandaloneBarsRegularIcon,
    StandaloneChartCandlestickRegularIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import { Badge } from '@deriv-com/quill-ui';
import { useStore } from '@deriv/stores';
import BottomNavItem from './bottom-nav-item';
import { useHistory, useLocation } from 'react-router';

type BottomNavProps = {
    children: React.ReactNode;
    className?: string;
};

const BottomNav = observer(({ children, className }: BottomNavProps) => {
    const history = useHistory();
    const location = useLocation();
    const { active_positions_count } = useStore().portfolio;

    const bottomNavItems = [
        {
            icon: (
                <StandaloneChartCandlestickRegularIcon
                    iconSize='sm'
                    fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                />
            ),
            label: <Localize i18n_default_text='Trade' />,
            path: routes.trade,
        },
        {
            icon: (
                <LegacyMarketBasketIndicesIcon
                    iconSize='sm'
                    fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                />
            ),
            label: <Localize i18n_default_text='Markets' />,
            path: routes.markets,
        },
        {
            icon:
                active_positions_count > 0 ? (
                    <Badge
                        variant='notification'
                        position='top-right'
                        label={active_positions_count.toString()}
                        color='danger'
                        size='sm'
                        contentSize='sm'
                    >
                        <StandaloneClockThreeRegularIcon
                            iconSize='sm'
                            fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                        />
                    </Badge>
                ) : (
                    <StandaloneClockThreeRegularIcon
                        iconSize='sm'
                        fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                    />
                ),
            label: <Localize i18n_default_text='Positions' />,
            path: routes.trader_positions,
        },
        {
            icon: (
                <StandaloneBarsRegularIcon iconSize='sm' fill='var(--semantic-color-monochrome-textIcon-normal-high)' />
            ),
            label: <Localize i18n_default_text='Menu' />,
            path: routes.trader_menu,
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
            <div className='bottom-nav-selection'>{children}</div>
            <div className='bottom-nav-container'>
                {bottomNavItems.map((item, index) => (
                    <BottomNavItem
                        key={index}
                        index={index}
                        icon={item.icon}
                        selectedIndex={selectedIndex}
                        label={item.label}
                        setSelectedIndex={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
});

export default BottomNav;
