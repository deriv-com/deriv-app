import React, { useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig, useMobileCarouselWalletsList } from '@deriv/api-v2';
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
    const { data: walletAccountsList, isLoading: isWalletAccountsListLoading } = useMobileCarouselWalletsList();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const [selectedLoginId, setSelectedLoginId] = useState('');
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

    // for the embla "on select" callback
    // to avoid unbinding / cleaning etc, just let it use up-to-date list
    const walletsAccountsListRef = useRef(walletAccountsList);

    const [walletsCarouselEmblaRef, walletsCarouselEmblaApi] = useEmblaCarousel({
        containScroll: false,
        skipSnaps: true,
    });

    useEffect(() => {
        walletsAccountsListRef.current = walletAccountsList;
    }, [walletAccountsList]);

    // set login ID once wallet changes
    useEffect(() => {
        if (activeWallet) {
            setSelectedLoginId(activeWallet?.loginid);
        }
    }, [activeWallet]);

    // bind to embla events
    useEffect(() => {
        walletsCarouselEmblaApi?.on('select', () => {
            const index = walletsCarouselEmblaApi?.selectedScrollSnap();
            if (index === undefined) {
                return;
            }
            const loginId = walletsAccountsListRef?.current?.[index]?.loginid;

            loginId && setSelectedLoginId(loginId);
        });

        // on settle, this is only for tutorial / onboarding plugin in some other components,
        walletsCarouselEmblaApi?.on('settle', () => {
            onWalletSettled?.(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletsCarouselEmblaApi]);

    // load active wallet whenever its scrolled
    useEffect(() => {
        if (selectedLoginId) {
            switchAccount(selectedLoginId);
            const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
            walletsCarouselEmblaApi?.scrollTo(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLoginId, walletAccountsList]);

    // initial loading
    useEffect(() => {
        if (walletsCarouselEmblaApi && isInitialDataLoaded) {
            const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
            walletsCarouselEmblaApi?.scrollTo(index, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletsCarouselEmblaApi, isInitialDataLoaded]);

    useEffect(() => {
        const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
        setCurrentIndex(index);
    }, [selectedLoginId, walletAccountsList]);

    // set the initial data loading flag to false once all "is loading" flags are false,
    // as then and only then we can display all the stuff and we want to display it permanently after that
    useEffect(() => {
        if (!isWalletAccountsListLoading && !isActiveWalletLoading && !isCurrencyConfigLoading) {
            setIsInitialDataLoaded(true);
        }
    }, [isWalletAccountsListLoading, isActiveWalletLoading, isCurrencyConfigLoading]);

    if (!isInitialDataLoaded) {
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
                    activeIndex={currentIndex}
                    count={walletAccountsList?.length ?? 0}
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
