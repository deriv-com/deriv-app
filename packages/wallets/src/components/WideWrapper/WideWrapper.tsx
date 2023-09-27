import React from 'react';
import './WideWrapper.scss';

type TWideWrapperProps = {
    renderFooter: () => React.ReactNode;
    renderHeader: () => React.ReactNode;
};

const WideWrapper = ({ children, renderFooter, renderHeader }: React.PropsWithChildren<TWideWrapperProps>) => {
    return (
        <div className='wallets-wide-wrapper'>
            <div className='wallets-wide-wrapper__header'>{renderHeader()}</div>
            {children}
            <div className='wallets-wide-wrapper__footer'>{renderFooter()}</div>
        </div>
    );
};

export default WideWrapper;
