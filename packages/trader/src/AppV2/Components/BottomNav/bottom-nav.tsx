import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import {
    LegacyMarketBasketIndicesIcon,
    StandaloneBarsRegularIcon,
    StandaloneChartCandlestickRegularIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import { Badge } from '@deriv-com/quill-ui';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import BottomNavItem from './bottom-nav-item';

type BottomNavProps = {
    children: React.ReactNode[];
    className?: string;
    selectedItemIdx?: number;
    setSelectedItemIdx?: React.Dispatch<React.SetStateAction<number>>;
};

const BottomNav = observer(({ children, className, selectedItemIdx = 0, setSelectedItemIdx }: BottomNavProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(selectedItemIdx);
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
        },
        {
            icon: (
                <LegacyMarketBasketIndicesIcon
                    iconSize='sm'
                    fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                />
            ),
            label: <Localize i18n_default_text='Markets' />,
        },
        {
            icon: (
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
            ),
            label: <Localize i18n_default_text='Positions' />,
        },
        {
            icon: (
                <StandaloneBarsRegularIcon iconSize='sm' fill='var(--semantic-color-monochrome-textIcon-normal-high)' />
            ),
            label: <Localize i18n_default_text='Menu' />,
        },
    ];

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        setSelectedItemIdx?.(index);
    };

    React.useEffect(() => {
        setSelectedIndex(selectedItemIdx);
    }, [selectedItemIdx]);

    return (
        <div className={classNames('bottom-nav', className)}>
            <div className='bottom-nav-selection'>{children[selectedIndex]}</div>
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
