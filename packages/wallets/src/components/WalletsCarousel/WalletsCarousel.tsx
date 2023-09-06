import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useWalletAccountsList } from '@deriv/api';
import AccountsList from '../AccountsList';
import { ProgressBar } from '../ProgressBar';
import { WalletCard } from '../WalletCard';
import { WalletListCardIActions } from '../WalletListCardIActions';
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
                <div className='wallets-carousel__container'>
                    {wallet_accounts_list.map(wallet => (
                        <WalletCard key={`${wallet.loginid}`} account={wallet} />
                    ))}
                </div>
                <div className='wallets-carousel__progress-bar'>
                    <ProgressBar
                        step={active_index + 1}
                        amount_of_steps={wallet_accounts_list.map((_, idx) => idx.toString())}
                        setStep={setActiveIndex}
                        is_transition={true}
                    />
                </div>
                <div className='wallets-carousel__actions'>
                    <WalletListCardIActions is_desktop_wallet={false} />
                </div>
            </div>
            <AccountsList data={wallet_accounts_list?.[active_index]} />
        </React.Fragment>
    );
};

export default WalletsCarousel;
