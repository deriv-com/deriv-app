import React from 'react';
import { TWalletAccount } from 'Types';
import { WalletCard, ProgressBarOnboarding } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import { useStore, observer } from '@deriv/stores';
import './wallet-cards-carousel.scss';

type TProps = {
    readonly items: TWalletAccount[];
    setActivePage: React.Dispatch<React.SetStateAction<number>>;
    active_page: number;
};

const CardsSliderSwiper = observer(({ items, setActivePage, active_page }: TProps) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const OPTIONS: EmblaOptionsType = { skipSnaps: true };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

    const steps = items.map((_, idx) => idx.toString());

    const scrollTo = React.useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index - 1);
            setActivePage(index - 1);
        },
        [emblaApi, setActivePage]
    );

    const onSelect = React.useCallback(() => {
        if (emblaApi) setActivePage(emblaApi.selectedScrollSnap());
    }, [emblaApi, setActivePage]);

    React.useEffect(() => {
        if (!emblaApi) return;

        onSelect();
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    const slider = React.useMemo(
        () =>
            items?.map((item: TWalletAccount) => (
                <div key={`${item.name} ${item.currency} ${item.landing_company_name}`}>
                    <WalletCard
                        wallet={{
                            currency: item.currency,
                            icon: item.icon,
                            icon_type: item.icon_type,
                            name: item.name,
                            balance: formatMoney(item.currency, item.balance, true),
                            jurisdiction_title: item.landing_company_name,
                            gradient_class: item.gradient_card_class,
                        }}
                        size='medium'
                    />
                </div>
            )),
        [items.length, is_dark_mode_on]
    );

    return (
        <React.Fragment>
            <div className='wallet-cards-carousel__viewport' ref={emblaRef}>
                <div className='wallet-cards-carousel__container'>{slider}</div>
            </div>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding
                    step={Number(active_page) + 1}
                    amount_of_steps={steps}
                    is_transition={true}
                    setStep={scrollTo}
                />
            </div>
        </React.Fragment>
    );
});

export default CardsSliderSwiper;
