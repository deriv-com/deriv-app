import React from 'react';
import { useActiveWallet } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import WalletButton from 'Components/wallet-button';
import { getWalletHeaderButtons } from 'Constants/utils';
import CardsSliderSwiper from './cards-slider-swiper';
import './wallet-cards-carousel.scss';

const WalletCardsCarousel = observer(() => {
    const { ui, traders_hub } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;
    const active_wallet = useActiveWallet();

    const wallet_buttons = getWalletHeaderButtons(active_wallet?.is_demo || false);

    return (
        <div className='wallet-cards-carousel traders-hub__wallets-bg'>
            <CardsSliderSwiper />
            <div className='wallet-cards-carousel__buttons'>
                {wallet_buttons.map(button => {
                    button.action = () => {
                        setWalletModalActiveTab(button.name);
                        setIsWalletModalVisible(true);
                        setWalletModalActiveWalletID(active_wallet?.loginid);
                    };

                    return <WalletButton key={button.name} button={button} />;
                })}
            </div>
        </div>
    );
});

export default WalletCardsCarousel;
