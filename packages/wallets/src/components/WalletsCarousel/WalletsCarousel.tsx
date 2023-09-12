import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useWalletAccountsList } from '@deriv/api';
import { AccountsList } from '..';
import './WalletsCarousel.scss';

const WalletsCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });
    const [active_index, setActiveIndex] = useState(0);
    const { data: wallet_accounts_list } = useWalletAccountsList();

    React.useEffect(() => {
        emblaApi?.scrollTo(active_index);
    }, [active_index, emblaApi]);

    React.useEffect(() => {
        emblaApi?.on('select', () => {
            const scroll_snap_index = emblaApi.selectedScrollSnap();
            setActiveIndex(scroll_snap_index);
        });
    }, [emblaApi]);

    if (!wallet_accounts_list.length) return <h1>No wallets found</h1>;

    return (
        <React.Fragment>
            <div className='wallets-carousel' ref={emblaRef}>
                <section className='wallets-carousel__container'>
                    {wallet_accounts_list.map(wallet => (
                        <div className='wallets-card' key={wallet.loginid}>
                            <div className='wallets-card__data'>
                                <div className='wallets-card__data__details'>
                                    <h1>{wallet.currency}</h1>
                                    <div className='wallets-card__data__details-balance'>
                                        <p>{wallet.currency} Wallet</p>
                                        <h3>
                                            {wallet.balance} {wallet.currency}
                                        </h3>
                                    </div>
                                </div>
                                <div className='wallets-card__data__landing-company'>
                                    <p>{wallet.landing_company_name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
            <AccountsList />
        </React.Fragment>
    );
};

export default WalletsCarousel;
