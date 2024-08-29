import { Text } from '@deriv-com/quill-ui';
import classNames from 'classnames';
import React from 'react';

type BottomNavItemProps = {
    icon: React.ReactNode;
    selectedIndex: number;
    label: React.ReactNode;
    setSelectedIndex: (index: number) => void;
    index: number;
};

const BottomNavItem = ({ icon, selectedIndex, label, index, setSelectedIndex }: BottomNavItemProps) => {
    const isActive = index === selectedIndex;
    return (
        <button
            className={classNames('bottom-nav-item', isActive ? 'bottom-nav-item--active' : '')}
            onClick={() => setSelectedIndex(index)}
        >
            {/* TODO: remove after Vinu's PR will be merged */}
            {index === 1 && <span className='user__guide__anchor' />}
            <span className='bottom-nav-item__icon'>{icon}</span>
            <Text size='sm' className='bottom-nav-item__label'>
                {label}
            </Text>
        </button>
    );
};

export default BottomNavItem;
