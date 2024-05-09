import React from 'react';
import { Localize } from '@deriv/translations';
import {
    LegacyMarketBasketIndicesIcon,
    LegacyMenuHamburger1pxIcon,
    StandaloneChartCandlestickRegularIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import BottomNavItem from './BottomNavItem';
import { Badge } from '@deriv-com/quill-ui';

type BottomNavProps = {
    className?: string;
    children: React.ReactNode[];
};

const BottomNavItems = [
    {
        icon: <StandaloneChartCandlestickRegularIcon iconSize='sm' />,
        label: <Localize i18n_default_text='Trade' />,
    },
    {
        icon: <LegacyMarketBasketIndicesIcon iconSize='sm' />,
        label: <Localize i18n_default_text='Markets' />,
    },
    {
        icon: (
            <Badge variant='notification' position='top-right' label='10' color='danger' size='sm' contentSize='sm'>
                <StandaloneClockThreeRegularIcon iconSize='sm' />
            </Badge>
        ),
        label: <Localize i18n_default_text='Positions' />,
    },
    {
        icon: <LegacyMenuHamburger1pxIcon iconSize='sm' />,
        label: <Localize i18n_default_text='Menu' />,
    },
];

const BottomNav = ({ className, children }: BottomNavProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    return (
        <div className={className}>
            <div className='bottomNav-container'>
                {BottomNavItems.map((item, index) => (
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
        </div>
    );
};

export default BottomNav;
