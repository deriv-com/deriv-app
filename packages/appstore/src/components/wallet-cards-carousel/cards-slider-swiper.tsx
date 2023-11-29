import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WalletCard, ProgressBarTracker } from '@deriv/components';
import { useWalletsList } from '@deriv/hooks';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getAccountName } from 'Constants/utils';
import { TWalletAccount } from 'Types';
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
            data?.map((item: TWalletAccount) => {
                const { loginid, icon, currency_config, balance, currency, landing_company_name, gradient_card_class } =
                    item;
                return (
                    <div key={`${loginid}`}>
                        <WalletCard
                            wallet={{
                                currency: currency_config?.display_code,
                                icon,
                                icon_type: currency_config?.type,
                                name: getAccountName({
                                    account_type: 'wallet',
                                    display_currency_code: currency_config?.display_code,
                                }),
                                balance: formatMoney(currency, balance, true),
                                jurisdiction_title: landing_company_name,
                                gradient_class: gradient_card_class,
                            }}
                            size='medium'
                        />
                    </div>
                );
            }),
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
                    is_transition
                    onStepChange={setActiveIndex}
                />
            </div>
        </React.Fragment>
    );
});

export default CardsSliderSwiper;
