import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import LeftArrowIcon from '../../public/ic-arrow-left.svg';
import './FullPageMobileWrapper.scss';

type TFullPageMobileWrapperProps = {
    onClickBack?: () => void;
    renderFooter?: () => React.ReactNode;
    renderHeader?: () => React.ReactNode;
    shouldFixedFooter?: boolean;
    shouldShowBackIcon?: boolean;
};

const FullPageMobileWrapper = ({
    children,
    onClickBack,
    renderFooter,
    renderHeader,
    shouldFixedFooter = true,
    shouldShowBackIcon = true,
}: PropsWithChildren<TFullPageMobileWrapperProps>) => {
    return (
        <div
            className={clsx('p2p-v2-mobile-wrapper', {
                'p2p-v2-mobile-wrapper--fixed-footer': shouldFixedFooter,
                'p2p-v2-mobile-wrapper--no-header': !renderHeader,
                'p2p-v2-mobile-wrapper--no-header-fixed-footer': !renderHeader && shouldFixedFooter,
            })}
        >
            {renderHeader && (
                <div className='p2p-v2-mobile-wrapper__header'>
                    {shouldShowBackIcon && <LeftArrowIcon onClick={onClickBack} />}
                    {renderHeader()}
                </div>
            )}
            <div className='p2p-v2-mobile-wrapper__body'>{children}</div>
            {renderFooter && <div className={clsx('p2p-v2-mobile-wrapper__footer')}>{renderFooter()}</div>}
        </div>
    );
};

export default FullPageMobileWrapper;
