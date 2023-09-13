import React, { useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import { ProgressBar } from '../ProgressBar';
import { WalletCard } from '../WalletCard';
import { WalletListCardIActions } from '../WalletListCardIActions';
import './WalletsCarouselContent.scss';

const WalletsCarouselContent: React.FC = () => {
    const { switchAccount } = useAuthorize();
    const [wallet_embla_ref, emblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });
    const { data: wallet_accounts_list } = useWalletAccountsList();
    const active_wallet_index = useMemo(
        () => wallet_accounts_list.findIndex(item => item?.is_active) || emblaApi?.selectedScrollSnap() || 0,
        [wallet_accounts_list, emblaApi]
    );

    useEffect(() => {
        emblaApi?.scrollTo(active_wallet_index);
    }, [active_wallet_index, emblaApi]);

    useEffect(() => {
        emblaApi?.on('settle', () => {
            const scroll_snap_index = emblaApi?.selectedScrollSnap();
            const loginid = wallet_accounts_list[scroll_snap_index]?.loginid;
            switchAccount(loginid);
        });
    }, [emblaApi, switchAccount, wallet_accounts_list]);

    const amount_of_steps = Array.from({ length: wallet_accounts_list.length }, (_, idx) => idx + 1);

    if (!wallet_accounts_list.length) return <h1>No wallets found</h1>;

    return (
        <div className='wallets-carousel-content' ref={wallet_embla_ref}>
            <div className='wallets-carousel-content__container'>
                {wallet_accounts_list.map(wallet => (
                    <WalletCard key={`${wallet.loginid}`} account={wallet} />
                ))}
            </div>
            <div className='wallets-carousel-content__progress-bar'>
                <ProgressBar
                    active_index={active_wallet_index + 1}
                    indexes={amount_of_steps}
                    setActiveIndex={() => switchAccount('')}
                    is_transition
                />
            </div>
            <WalletListCardIActions />
        </div>
    );
};

export default WalletsCarouselContent;
