import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import LeftArrowIcon from '../../public/ic-arrow-left.svg';
import './FullPageMobileWrapper.scss';

type TFullPageMobileWrapperProps = {
    onGoBack?: () => void;
    renderFooter?: () => React.ReactNode;
    renderHeader?: () => React.ReactNode;
    shouldFixedFooter?: boolean;
};

const FullPageMobileWrapper = ({
    children,
    onGoBack,
    renderFooter,
    renderHeader,
    shouldFixedFooter = true,
}: PropsWithChildren<TFullPageMobileWrapperProps>) => {
    return (
        <div
            className={clsx('p2p-v2-mobile-wrapper', {
                'p2p-v2-mobile-wrapper--fixed-footer': shouldFixedFooter,
            })}
        >
            {renderHeader && (
                <div className='p2p-v2-mobile-wrapper__header'>
                    <LeftArrowIcon onClick={() => onGoBack?.()} />
                    {renderHeader()}
                </div>
            )}
            <div className='p2p-v2-mobile-wrapper__body'>{children}</div>
            {renderFooter && <div className={clsx('p2p-v2-mobile-wrapper__footer')}>{renderFooter()} </div>}
        </div>
    );
};

export default FullPageMobileWrapper;
