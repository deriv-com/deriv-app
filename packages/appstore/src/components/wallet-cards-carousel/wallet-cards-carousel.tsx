import React from 'react';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import WalletButton from 'Components/wallet-button';
import CardsSliderSwiper from './cards-slider-swiper';
import './wallet-cards-carousel.scss';

type TProps = {
    readonly items: TWalletAccount[];
};

const WalletCardsCarousel = ({ items }: TProps) => {
    const [active_page, setActivePage] = React.useState(0);

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
