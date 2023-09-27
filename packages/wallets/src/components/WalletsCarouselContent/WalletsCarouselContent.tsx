import React, { useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import { ProgressBar } from '../ProgressBar';
import { WalletCard } from '../WalletCard';
// import { WalletListCardActions } from '../WalletListCardActions';
import './WalletsCarouselContent.scss';

const WalletsCarouselContent: React.FC = () => {
    const { switchAccount } = useAuthorize();
    const [walletsCarouselEmblaRef, walletsCarouselEmblaApi] = useEmblaCarousel({
        containScroll: false,
        skipSnaps: true,
    });
    const { data: walletAccountsList } = useWalletAccountsList();
    const activeWalletIndex = useMemo(
        () =>
            walletAccountsList?.findIndex(item => item?.is_active) ||
            walletsCarouselEmblaApi?.selectedScrollSnap() ||
            0,
        [walletAccountsList, walletsCarouselEmblaApi]
    );
    const [progressBarActiveIndex, setProgressBarActiveIndex] = React.useState(activeWalletIndex + 1);

    useEffect(() => {
        walletsCarouselEmblaApi?.scrollTo(activeWalletIndex);
    }, [activeWalletIndex, walletsCarouselEmblaApi]);

    useEffect(() => {
        walletsCarouselEmblaApi?.on('settle', () => {
            // const scroll_snap_index = walletsCarouselEmblaApi?.selectedScrollSnap();
            // const loginid = wallet_accounts_list[scroll_snap_index]?.loginid;
            // switchAccount(loginid);
        });

        walletsCarouselEmblaApi?.on('select', () => {
            const scrollSnapIndex = walletsCarouselEmblaApi?.selectedScrollSnap();
            setProgressBarActiveIndex(scrollSnapIndex + 1);
        });
    }, [walletsCarouselEmblaApi, switchAccount, walletAccountsList]);

    const amountOfSteps = useMemo(() => walletAccountsList?.map(wallet => wallet.loginid), [walletAccountsList]);

    return (
        <div className='wallets-carousel-content' ref={walletsCarouselEmblaRef}>
            <div className='wallets-carousel-content__container'>
                {walletAccountsList?.map(account => (
                    <WalletCard account={account} key={`wallet-card-${account.loginid}`} />
                ))}
            </div>
            <div className='wallets-carousel-content__progress-bar'>
                <ProgressBar
                    activeIndex={progressBarActiveIndex}
                    indexes={amountOfSteps || []}
                    isTransition
                    setActiveIndex={switchAccount}
                />
            </div>
            {/* <WalletListCardActions /> */}
        </div>
    );
};

export default WalletsCarouselContent;
