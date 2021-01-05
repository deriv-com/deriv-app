import React from 'react';

const Theme = ({ is_dark, max_width, children }) => (
    <div
        className={is_dark ? 'theme--dark' : 'theme--light'}
        style={{
            width: max_width ? `${max_width}px` : '100%',
            background: 'var(--general-main-1)',
        }}
    >
        {children}
    </div>
);

export default Theme;
