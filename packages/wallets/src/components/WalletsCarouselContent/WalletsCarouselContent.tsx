import React, { useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import { ProgressBar } from '../ProgressBar';
import { WalletCard } from '../WalletCard';
import { WalletListCardIActions } from '../WalletListCardIActions';
import './WalletsCarouselContent.scss';

const WalletsCarouselContent: React.FC = () => {
    const { switchAccount } = useAuthorize();
    const [wallet_embla_ref, walletsCarouselEmblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });
    const { data: wallet_accounts_list } = useWalletAccountsList();
    const active_wallet_index = useMemo(
        () =>
            wallet_accounts_list.findIndex(item => item?.is_active) ||
            walletsCarouselEmblaApi?.selectedScrollSnap() ||
            0,
        [wallet_accounts_list, walletsCarouselEmblaApi]
    );

    useEffect(() => {
        walletsCarouselEmblaApi?.scrollTo(active_wallet_index);
    }, [active_wallet_index, walletsCarouselEmblaApi]);

    useEffect(() => {
        walletsCarouselEmblaApi?.on('settle', () => {
            const scroll_snap_index = walletsCarouselEmblaApi?.selectedScrollSnap();
            const loginid = wallet_accounts_list[scroll_snap_index]?.loginid;
            switchAccount(loginid);
        });
    }, [walletsCarouselEmblaApi, switchAccount, wallet_accounts_list]);

    const amount_of_steps = useMemo(() => wallet_accounts_list?.map(wallet => wallet.loginid), [wallet_accounts_list]);

    if (!wallet_accounts_list.length) return <h1>No wallets found</h1>;

    return (
        <div className='wallets-carousel-content' ref={wallet_embla_ref}>
            <div className='wallets-carousel-content__container'>
                {wallet_accounts_list.map(account => (
                    <WalletCard key={`${account.loginid}`} account={account} />
                ))}
            </div>
            <div className='wallets-carousel-content__progress-bar'>
                <ProgressBar
                    active_index={active_wallet_index + 1}
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
