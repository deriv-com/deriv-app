import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router';
import { routes } from '@deriv/shared';
import { Navigation } from '@deriv-com/quill-ui';

type BottomNavObject = {
    icon: React.JSX.Element;
    activeIcon: React.JSX.Element;
    label: React.JSX.Element;
    path: string;
};

type BottomNavProps = {
    bottomNavItems?: BottomNavObject[];
};

const BottomNav = observer(({ bottomNavItems }: BottomNavProps) => {
    const history = useHistory();
    const location = useLocation();

    const navIndex = bottomNavItems?.findIndex(item => item.path === location.pathname);

    const [selectedIndex, setSelectedIndex] = React.useState(navIndex && navIndex > -1 ? navIndex : 0);

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        bottomNavItems && history.push(bottomNavItems[index].path);
    };

    return (
        <Navigation.Bottom className='bottom-nav' onChange={(_, index) => handleSelect(index)}>
            {bottomNavItems?.map((item, index) => (
                <Navigation.BottomAction
                    key={index}
                    index={index}
                    activeIcon={<></>}
                    icon={index === selectedIndex ? item.activeIcon : item.icon}
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
    );
});

export default BottomNav;
