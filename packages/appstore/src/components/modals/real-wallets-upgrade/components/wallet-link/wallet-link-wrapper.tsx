import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { ContentWithLink } from '../content-with-link';
import './wallet-link-wrapper.scss';

export type TWalletLinkWrapper = {
    left?: () => JSX.Element | Array<JSX.Element>;
    center?: () => JSX.Element;
    right?: () => JSX.Element | Array<JSX.Element>;
    has_left_fork?: boolean;
    has_right_fork?: boolean;
};

const WalletLinkWrapper = observer(({ left, center, right, has_left_fork, has_right_fork }: TWalletLinkWrapper) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='wallet-link-wrapper'>
            {left && (
                <div className='wallet-link-wrapper__left'>
                    <div className='wallet-link-wrapper__accounts'>
                        <ContentWithLink is_mobile={is_mobile} has_fork={has_left_fork} fork_margin={24}>
                            {left()}
                        </ContentWithLink>
                    </div>
                </div>
            )}
            {center && <div className='wallet-link-wrapper__center'>{center()}</div>}
            {right && (
                <div className='wallet-link-wrapper__right'>
                    <ContentWithLink is_mobile={is_mobile} rtl has_fork={has_right_fork} fork_margin={24}>
                        {right()}
                    </ContentWithLink>
                </div>
            )}
        </div>
    );
});

export default WalletLinkWrapper;
