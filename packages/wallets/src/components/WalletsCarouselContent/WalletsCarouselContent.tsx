import React, { useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import { ProgressBar } from '../ProgressBar';
import { WalletCard } from '../WalletCard';
import { WalletListCardIActions } from '../WalletListCardIActions';
import './WalletsCarouselContent.scss';

const WalletsCarouselContent: React.FC = () => {
    const { switchAccount } = useAuthorize();
    const [wallets_carousel_embla_ref, wallets_carousel_embla_api] = useEmblaCarousel({
        skipSnaps: true,
        containScroll: false,
    });
    const { data: wallet_accounts_list } = useWalletAccountsList();
    const active_wallet_index = useMemo(
        () =>
            wallet_accounts_list.findIndex(item => item?.is_active) ||
            wallets_carousel_embla_api?.selectedScrollSnap() ||
            0,
        [wallet_accounts_list, wallets_carousel_embla_api]
    );
    const [progress_bar_active_index, setProgressBarActiveIndex] = React.useState(active_wallet_index + 1);

    useEffect(() => {
        wallets_carousel_embla_api?.scrollTo(active_wallet_index);
    }, [active_wallet_index, wallets_carousel_embla_api]);

    useEffect(() => {
        wallets_carousel_embla_api?.on('settle', () => {
            // const scroll_snap_index = walletsCarouselEmblaApi?.selectedScrollSnap();
            // const loginid = wallet_accounts_list[scroll_snap_index]?.loginid;
            // switchAccount(loginid);
        });

        wallets_carousel_embla_api?.on('select', () => {
            const scroll_snap_index = wallets_carousel_embla_api?.selectedScrollSnap();
            setProgressBarActiveIndex(scroll_snap_index + 1);
        });
    }, [wallets_carousel_embla_api, switchAccount, wallet_accounts_list]);

    const amount_of_steps = useMemo(() => wallet_accounts_list?.map(wallet => wallet.loginid), [wallet_accounts_list]);

    if (!wallet_accounts_list.length) return <h1>No wallets found</h1>;

    return (
        <div className='wallets-carousel-content' ref={wallets_carousel_embla_ref}>
            <div className='wallets-carousel-content__container'>
                {wallet_accounts_list.map(account => (
                    <WalletCard key={`wallet-card-${account.loginid}`} account={account} />
                ))}
            </div>
            <div className='wallets-carousel-content__progress-bar'>
                <ProgressBar
                    active_index={progress_bar_active_index}
                    indexes={amount_of_steps}
                    setActiveIndex={switchAccount}
                    is_transition
                />
            </div>
            <WalletListCardIActions />
        </div>
    );
};

export default WalletsCarouselContent;
