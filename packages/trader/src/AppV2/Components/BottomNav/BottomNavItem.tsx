import { CaptionText } from '@deriv-com/quill-ui';
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
            <span>{icon}</span>
            {/* //waiting on quill-tokens */}
            <CaptionText size='sm' color='var(--core-color-opacity-black-600)'>
                {label}
            </CaptionText>
        </button>
    );
};

export default BottomNavItem;
