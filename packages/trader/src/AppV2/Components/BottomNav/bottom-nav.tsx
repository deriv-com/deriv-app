import React from 'react';
import classNames from 'classnames';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { StandaloneChartCandlestickRegularIcon, StandaloneClockThreeRegularIcon } from '@deriv/quill-icons';
import { Badge, Navigation } from '@deriv-com/quill-ui';
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
            icon:
                active_positions_count > 0 ? (
                    <Badge
                        variant='notification'
                        position='top-right'
                        label={active_positions_count.toString()}
                        color='danger'
                        size='sm'
                        contentSize='sm'
                        className='bottom-nav-item__position-badge'
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
                <Navigation.Bottom className='bottom-nav-container' onChange={(_, index) => handleSelect(index)}>
                    {bottomNavItems.map((item, index) => (
                        <Navigation.BottomAction
                            key={index}
                            index={index}
                            activeIcon={item.icon}
                            icon={item.icon}
                            label={item.label}
                            selected={index === selectedIndex}
                            showLabel
                            className={clsx(
                                'bottom-nav-item',
                                index === selectedIndex && 'bottom-nav-item--active',
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
