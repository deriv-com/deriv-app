import React, { useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import AccountsList from '../AccountsList';

const WalletsCarousel = () => {
    const { switchAccount } = useAuthorize();
    const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });
    const { data: wallet_accounts_list } = useWalletAccountsList();
    const active_wallet_index = useMemo(
        () => wallet_accounts_list.findIndex(item => item?.is_active) || emblaApi?.selectedScrollSnap() || 0,
        [wallet_accounts_list, emblaApi]
    );

    useEffect(() => {
        emblaApi?.scrollTo(active_wallet_index);
    }, [active_wallet_index, emblaApi]);

    useEffect(() => {
        emblaApi?.on('settle', () => {
            const scroll_snap_index = emblaApi?.selectedScrollSnap();
            const loginid = wallet_accounts_list[scroll_snap_index]?.loginid;
            switchAccount(loginid);
        });
    }, [emblaApi, switchAccount, wallet_accounts_list]);

    if (!wallet_accounts_list.length) return <h1>No wallets found</h1>;

    return (
        <React.Fragment>
            <div className='wallets-carousel' ref={emblaRef}>
                <section className='wallets-carousel__container'>
                    {wallet_accounts_list.map(account => (
                        <div
                            className='wallets-card'
                            key={account.loginid}
                            style={{ backgroundColor: account.is_active ? 'red' : 'blue' }}
                        >
                            <div className='wallets-card__data'>
                                <div className='wallets-card__data__details'>
                                    <h1>{account.currency}</h1>
                                    <div className='wallets-card__data__details-balance'>
                                        <p>{account.currency} Wallet</p>
                                        <h3>
                                            {account.balance} {account.currency}
                                        </h3>
                                    </div>
                                </div>
                                <div className='wallets-card__data__landing-company'>
                                    <p>{account.landing_company_name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
            <AccountsList data={wallet_accounts_list[active_wallet_index]} />
        </React.Fragment>
    );
};

export default WalletsCarousel;
