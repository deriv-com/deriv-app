import React from 'react';
import { ContentExpander } from '@deriv/components';

type AccountWrapperProps = {
    children: React.ReactNode;
    header: unknown | string;
    is_visible: boolean;
    toggleVisibility: () => void;
};

const AccountWrapper = ({ children, header, is_visible, toggleVisibility }: AccountWrapperProps) => (
    <ContentExpander
        className='acc-switcher'
        title={header}
        is_expanded={is_visible}
        onToggle={toggleVisibility}
        is_title_spaced
    >
        {children}
    </ContentExpander>
);

export default AccountWrapper;
