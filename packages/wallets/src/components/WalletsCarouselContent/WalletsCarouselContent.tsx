import React, { useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig, useStaleWalletsAccountsList } from '@deriv/api';
import { ProgressBar } from '../Base';
import { WalletsCarouselLoader } from '../SkeletonLoader';
import { WalletCard } from '../WalletCard';
import { WalletListCardActions } from '../WalletListCardActions';
import './WalletsCarouselContent.scss';

type TProps = {
    onWalletSettled?: (value: boolean) => void;
};

/**
 * carousel component
 * idea behind data flow here:
 * - Embla is the SINGLE SOURCE OF TRUTH for current active card, so the state flow / data flow is simple
 * - everything else gets in sync with Embla eventually
 */
const WalletsCarouselContent: React.FC<TProps> = ({ onWalletSettled }) => {
    const { switchAccount } = useAuthorize();
    const { data: walletAccountsList, isLoading: isWalletAccountsListLoading } = useStaleWalletsAccountsList();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const [selectedEmblaIndex, setSelectedEmblaIndex] = useState(-1);
    const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);

    const [walletsCarouselEmblaRef, walletsCarouselEmblaApi] = useEmblaCarousel({
        containScroll: false,
        skipSnaps: true,
    });

    // set initial wallet id
    useEffect(() => {
        if (selectedEmblaIndex === -1 && !isActiveWalletLoading) {
            const activeWalletIndex = walletAccountsList?.findIndex(({ loginid }) => loginid === activeWallet?.loginid);
            if (activeWalletIndex !== undefined && activeWalletIndex !== -1) {
                setSelectedEmblaIndex(activeWalletIndex);
            }
        }
    }, [activeWallet, isActiveWalletLoading]);

    // bind to embla change api
    useEffect(() => {
        walletsCarouselEmblaApi?.on('select', () => {
            const scrollSnapIndex = walletsCarouselEmblaApi?.selectedScrollSnap();
            setSelectedEmblaIndex(scrollSnapIndex);
        });

        // on settle, this is only for tutorial / onboarding plugin in some other components,
        walletsCarouselEmblaApi?.on('settle', () => {
            onWalletSettled && onWalletSettled(true);
        });
    }, [walletsCarouselEmblaApi]);

    // load active wallet whenever its changed
    useEffect(() => {
        const selectedLoginId = walletAccountsList?.[selectedEmblaIndex]?.loginid;
        if (selectedLoginId) {
            switchAccount(selectedLoginId);
            walletsCarouselEmblaApi?.scrollTo(selectedEmblaIndex, true);
        }
    }, [selectedEmblaIndex]);

    // set the initial data loading flag to false once all "is loading" flags are false,
    // as then and only then we can display all the stuff
    useEffect(() => {
        if (!isWalletAccountsListLoading && !isActiveWalletLoading && !isCurrencyConfigLoading) {
            setIsInitialDataLoading(false);
        }
    }, [isWalletAccountsListLoading, isActiveWalletLoading, isCurrencyConfigLoading]);

    if (isInitialDataLoading) {
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
                    activeIndex={selectedEmblaIndex}
                    count={walletAccountsList?.length || 0}
                    onClick={walletsCarouselEmblaApi?.scrollTo}
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
