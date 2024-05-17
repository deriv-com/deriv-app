import React from 'react';
import { Localize } from '@deriv/translations';
import {
    LegacyMarketBasketIndicesIcon,
    StandaloneBarsRegularIcon,
    StandaloneChartCandlestickRegularIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import BottomNavItem from './bottom-nav-item';
import { Badge } from '@deriv-com/quill-ui';

type BottomNavProps = {
    children: React.ReactNode[];
};

const bottomNavItems = [
    {
        icon: (
            <StandaloneChartCandlestickRegularIcon
                iconSize='sm'
                fill='var(--semantic-color-monochrome-textIcon-normal-high)'
            />
        ),
        label: <Localize i18n_default_text='Trade' />,
    },
    {
        icon: (
            <LegacyMarketBasketIndicesIcon iconSize='sm' fill='var(--semantic-color-monochrome-textIcon-normal-high)' />
        ),
        label: <Localize i18n_default_text='Markets' />,
    },
    {
        icon: (
            <Badge variant='notification' position='top-right' label='10' color='danger' size='sm' contentSize='sm'>
                <StandaloneClockThreeRegularIcon
                    iconSize='sm'
                    fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                />
            </Badge>
        ),
        label: <Localize i18n_default_text='Positions' />,
    },
    {
        icon: <StandaloneBarsRegularIcon iconSize='sm' fill='var(--semantic-color-monochrome-textIcon-normal-high)' />,
        label: <Localize i18n_default_text='Menu' />,
    },
];

const BottomNav = ({ children }: BottomNavProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    return (
        <React.Fragment>
            <div className='bottom-nav-container'>
                {bottomNavItems.map((item, index) => (
                    <BottomNavItem
                        key={index}
                        index={index}
                        icon={item.icon}
                        selectedIndex={selectedIndex}
                        label={item.label}
                        setSelectedIndex={setSelectedIndex}
                    />
                ))}
            </div>
            {children[selectedIndex]}
        </React.Fragment>
    );
};

export default BottomNav;
