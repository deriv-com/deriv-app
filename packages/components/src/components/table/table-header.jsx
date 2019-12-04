import React from 'react';

const Header = ({ children }) => {
    return (
        <div role='rowgroup' className='dc-table__header'>{children}</div >
    );
};

export default Header;
