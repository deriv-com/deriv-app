import React, { useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig, useWalletAccountsList } from '@deriv/api';
import { ProgressBar } from '../Base';
import { WalletsCarouselLoader } from '../SkeletonLoader';
import { WalletCard } from '../WalletCard';
import { WalletListCardActions } from '../WalletListCardActions';
import './WalletsCarouselContent.scss';

type TProps = {
    onWalletSettled?: (value: boolean) => void;
};

const WalletsCarouselContent: React.FC<TProps> = ({ onWalletSettled }) => {
    const { isLoading: isAuthorizeLoading, switchAccount } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();
    const { data: walletAccountsList } = useWalletAccountsList();
    const [isCarouselInitialized, setIsCarouselInitialized] = useState(false);
    const [walletsCarouselEmblaRef, walletsCarouselEmblaApi] = useEmblaCarousel({
        containScroll: false,
        skipSnaps: true,
    });

    useEffect(() => {
        if (walletsCarouselEmblaApi) {
            setIsCarouselInitialized(true);
        }
    }, [walletsCarouselEmblaApi]);

    const { data: activeWallet } = useActiveWalletAccount();
    const activeWalletIndex = useMemo(
        () =>
            walletAccountsList?.findIndex(wallet => wallet.loginid === activeWallet?.loginid) ??
            walletsCarouselEmblaApi?.selectedScrollSnap() ??
            0,
        [activeWallet?.loginid, walletAccountsList, walletsCarouselEmblaApi]
    );

    const [progressBarActiveIndex, setProgressBarActiveIndex] = useState(activeWalletIndex + 1);

    useEffect(() => {
        if (isCarouselInitialized) {
            walletsCarouselEmblaApi?.scrollTo(activeWalletIndex);
            setProgressBarActiveIndex(activeWalletIndex + 1);
        }
    }, [activeWalletIndex, isCarouselInitialized, walletsCarouselEmblaApi]);

    useEffect(() => {
        walletsCarouselEmblaApi?.on('settle', () => {
            const scrollSnapIndex = walletsCarouselEmblaApi?.selectedScrollSnap();
            const loginid = walletAccountsList?.[scrollSnapIndex]?.loginid;
            if (activeWallet?.loginid !== loginid) {
                switchAccount(loginid || '');
            }
            onWalletSettled?.(true);
        });

        walletsCarouselEmblaApi?.on('select', () => {
            const scrollSnapIndex = walletsCarouselEmblaApi?.selectedScrollSnap();
            setProgressBarActiveIndex(scrollSnapIndex + 1);
            onWalletSettled?.(false);
        });
    }, [walletsCarouselEmblaApi, switchAccount, walletAccountsList, activeWallet?.loginid, onWalletSettled]);

    const amountOfSteps = useMemo(() => walletAccountsList?.map(wallet => wallet.loginid), [walletAccountsList]);

    if (isAuthorizeLoading || isCurrencyConfigLoading) {
        return <WalletsCarouselLoader />;
    }

    return (
        <div className='wallets-carousel-content' ref={walletsCarouselEmblaRef}>
            <div className='wallets-carousel-content__container'>
                {walletAccountsList?.map(account => (
                    <WalletCard
                        balance={account.display_balance}
                        currency={account.currency || 'USD'}
                        isDemo={account.is_virtual}
                        key={`wallet-card-${account.loginid}`}
                        landingCompanyName={account.landing_company_name}
                    />
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
            <WalletListCardActions
                isActive={activeWallet?.is_active || false}
                isDemo={activeWallet?.is_virtual || false}
                loginid={activeWallet?.loginid || ''}
            />
        </div>
    );
};

export default WalletsCarouselContent;
