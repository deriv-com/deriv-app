import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaEventType } from 'embla-carousel-react';
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
    const tweenNodes = useRef<HTMLElement[]>([]);
    const tweenFactor = useRef(0);

    const numberWithinRange = (number: number, min: number, max: number): number =>
        Math.min(Math.max(number, min), max);

    // scale based on the width difference between active and inactive wallets
    const tweenFactorBase = 1 - 24 / 28.8;

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
        tweenNodes.current = emblaApi.slideNodes().map(slideNode => {
            return slideNode.querySelector('.wallets-card__container') as HTMLElement;
        });
    }, []);

    const setTweenFactor = useCallback(
        (emblaApi: EmblaCarouselType) => {
            tweenFactor.current = tweenFactorBase * emblaApi.scrollSnapList().length;
        },
        [tweenFactorBase]
    );

    const tweenScale = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();
        const isScrollEvent = eventName === 'scroll';

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[snapIndex];

            slidesInSnap.forEach(slideIndex => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach(loopItem => {
                        const target = loopItem.target();

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target);

                            if (sign === -1) {
                                diffToTarget = scrollSnap - (1 + scrollProgress);
                            }
                            if (sign === 1) {
                                diffToTarget = scrollSnap + (1 - scrollProgress);
                            }
                        }
                    });
                }

                const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
                const scale = numberWithinRange(tweenValue, 0, 1).toString();
                const tweenNode = tweenNodes.current[slideIndex];
                tweenNode.style.transform = `scale(${scale})`;
            });
        });
    }, []);

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

            walletsCarouselEmblaApi && setTweenNodes(walletsCarouselEmblaApi);
            walletsCarouselEmblaApi && setTweenFactor(walletsCarouselEmblaApi);
            walletsCarouselEmblaApi && tweenScale(walletsCarouselEmblaApi);

            walletsCarouselEmblaApi
                ?.on('reInit', setTweenNodes)
                .on('reInit', setTweenFactor)
                .on('reInit', tweenScale)
                .on('scroll', tweenScale);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletsCarouselEmblaApi, isInitialDataLoaded, tweenScale]);

    useEffect(() => {
        const index = walletAccountsList?.findIndex(({ loginid }) => loginid === selectedLoginId) ?? -1;
        if (index >= 0) {
            setCurrentIndex(index);
        }
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
                        iconSize='xl'
                        isCarouselContent
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
            <WalletListCardActions />
        </div>
    );
};

export default WalletsCarouselContent;
