import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { TWalletAccount } from 'Types';
import { WalletCard, ProgressBarTracker } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useWalletsList } from '@deriv/hooks';
import { getAccountName } from 'Constants/utils';
import './wallet-cards-carousel.scss';

const CardsSliderSwiper = observer(() => {
    const { client } = useStore();
    const { switchAccount } = client;
    const { data } = useWalletsList();

    const active_wallet_index = data.findIndex(item => item?.is_selected) || 0;

    const [active_index, setActiveIndex] = useState(active_wallet_index);
    const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });

    const steps = data.map((_, idx) => idx.toString());

    useEffect(() => {
        emblaApi?.on('select', () => {
            const index = emblaApi?.selectedScrollSnap() || 0;
            setActiveIndex(index + 1);
        });

        emblaApi?.on('settle', () => {
            const index = emblaApi?.selectedScrollSnap() || 0;
            if (!data[index]?.is_selected) switchAccount(data[index]?.loginid);
        });
    }, [active_index, data, emblaApi, switchAccount]);

    useEffect(() => {
        emblaApi?.scrollTo(active_index - 1);
    }, [active_index, emblaApi]);

    useEffect(() => {
        setActiveIndex(active_wallet_index + 1);
    }, [active_wallet_index]);

    const slider = React.useMemo(
        () =>
            data?.map((item: TWalletAccount) => (
                <div key={`${item.loginid}`}>
                    <WalletCard
                        wallet={{
                            currency: item.currency_config?.display_code,
                            icon: item.icon,
                            icon_type: item.currency_config?.type,
                            name: getAccountName({
                                account_type: 'wallet',
                                display_currency_code: item.currency_config?.display_code,
                            }),
                            balance: formatMoney(item.currency, item.balance, true),
                            jurisdiction_title: item.landing_company_name,
                            gradient_class: item.gradient_card_class,
                        }}
                        size='medium'
                    />
                </div>
            )),
        [data]
    );

    return (
        <React.Fragment>
            <div ref={emblaRef}>
                <div className='wallet-cards-carousel__container'>{slider}</div>
            </div>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarTracker
                    step={active_index}
                    steps_list={steps}
                    is_transition={true}
                    setStep={setActiveIndex}
                />
            </div>
        </React.Fragment>
    );
});

export default CardsSliderSwiper;
