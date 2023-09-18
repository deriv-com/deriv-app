import React from 'react';
import { Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './wallet-link-wrapper.scss';
import { ContentWithLink } from '../content-with-link';

export type TWalletLinkWrapper = {
    key: React.Key;
    left?: () => JSX.Element | Array<JSX.Element>;
    center?: () => JSX.Element;
    right?: () => JSX.Element | Array<JSX.Element>;
    show_left_fork?: boolean;
    show_right_fork?: boolean;
};

const WalletLinkWrapper = observer(({ left, center, right, show_left_fork, show_right_fork }: TWalletLinkWrapper) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='wallet-link-wrapper'>
            <div className='wallet-link-wrapper__left'>
                <div className='wallet-link-wrapper__accounts'>
                    <ContentWithLink is_mobile={is_mobile} is_right_forked show_fork={show_left_fork} fork_margin={24}>
                        {left && left()}
                    </ContentWithLink>
                </div>
            </div>
            <div className='wallet-link-wrapper__center'>
                <div className='wallet-link-wrapper__link-icon'>
                    <Icon icon='IcAppstoreWalletsLink' size={40} />
                </div>
                {center && center()}
            </div>
            <div className='wallet-link-wrapper__right'>
                <ContentWithLink is_mobile={is_mobile} show_fork={show_right_fork} fork_margin={24}>
                    {right && right()}
                </ContentWithLink>
            </div>
        </div>
    );
});

export default WalletLinkWrapper;
