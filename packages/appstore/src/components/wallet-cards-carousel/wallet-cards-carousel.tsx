import React from 'react';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import WalletButton from 'Components/wallet-button';
import CardsSliderSwiper from './cards-slider-swiper';
import './wallet-cards-carousel.scss';

type TProps = {
    readonly items: TWalletAccount[];
    setSelectedWallet: (value: string) => void;
    active_wallet_index: number;
};

const WalletCardsCarousel = ({ items, setSelectedWallet, active_wallet_index }: TProps) => {
    const [active_page, setActivePage] = React.useState(active_wallet_index);

    React.useEffect(() => {
        setSelectedWallet(items[active_page]?.loginid);
    }, [active_page, items, setSelectedWallet]);

    const wallet_buttons = getWalletHeaderButtons(items[active_page]?.is_virtual);

    return (
        <div className='wallet-cards-carousel traders-hub__wallets-bg'>
            <CardsSliderSwiper items={items} setActivePage={setActivePage} />
            <div className='wallet-cards-carousel__buttons'>
                {wallet_buttons.map(button => (
                    <WalletButton key={button.name} button={button} />
                ))}
            </div>
        </div>
    );
};
WalletCardsCarousel.displayName = 'WalletCardsCarousel';

export default WalletCardsCarousel;
