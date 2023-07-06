import React from 'react';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import WalletButton from 'Components/wallet-button';
import CardsSliderSwiper from './cards-slider-swiper';
import { observer, useStore } from '@deriv/stores';
import './wallet-cards-carousel.scss';

type TProps = {
    readonly items: TWalletAccount[];
};

const WalletCardsCarousel = observer(({ items }: TProps) => {
    const { client, ui, traders_hub } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;
    const { loginid, switchAccount } = client;

    const [active_page, setActivePage] = React.useState(
        items.findIndex(item => item?.loginid === loginid) === -1
            ? 0
            : items.findIndex(item => item?.loginid === loginid)
    );

    React.useEffect(() => {
        const switchWallet = async () => {
            if (loginid !== items[active_page]?.loginid) await switchAccount(items[active_page]?.loginid);
        };

        switchWallet();
    }, [active_page, items, loginid, switchAccount]);

    const wallet_buttons = getWalletHeaderButtons(items[active_page]?.is_virtual);

    return (
        <div className='wallet-cards-carousel traders-hub__wallets-bg'>
            <CardsSliderSwiper items={items} setActivePage={setActivePage} active_page={active_page} />
            <div className='wallet-cards-carousel__buttons'>
                {wallet_buttons.map(button => {
                    button.action = async () => {
                        setWalletModalActiveTab(button.name);
                        setIsWalletModalVisible(true);
                        setWalletModalActiveWalletID(items[active_page]?.loginid);
                    };

                    return <WalletButton key={button.name} button={button} />;
                })}
            </div>
        </div>
    );
});

export default WalletCardsCarousel;
