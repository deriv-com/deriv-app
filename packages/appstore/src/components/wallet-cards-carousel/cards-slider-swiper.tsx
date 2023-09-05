import React, { useEffect, useState } from 'react';
import { TWalletAccount } from 'Types';
import { WalletCard, ProgressBarTracker } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import useEmblaCarousel from 'embla-carousel-react';
import { getAccountName } from 'Constants/utils';
import { useWalletsList } from '@deriv/hooks';
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
    }, [emblaApi]);

    useEffect(() => {
        emblaApi?.scrollTo(active_index - 1);
    }, [active_index, emblaApi]);

    useEffect(() => {
        const timeout_id = setTimeout(() => {
            if (!data[active_index - 1]?.is_selected) switchAccount(data[active_index - 1]?.loginid);
        }, 1000);

        return () => clearTimeout(timeout_id);
    }, [active_index, data, switchAccount]);

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
        [data?.length]
    );

    return (
        <React.Fragment>
            <div className='wallet-cards-carousel__viewport' ref={emblaRef}>
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
