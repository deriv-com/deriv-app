import React from 'react';
import { Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

const USDTSideNote = () => {
    const [is_modal_open, setModalOpen] = React.useState(false);

    const handleLearnMore = () => {
        setModalOpen(!is_modal_open);
    };

    return (
        <div className='cashier__usdt-side-note'>
            <h2 className='cashier__usdt-side-note--header'>
                <Localize i18n_default_text='About Tether' />
            </h2>
            <p>
                <Localize
                    i18n_default_text='Deriv currently supports withdrawals of Tether USDT to Omni wallet and Tether eUSDT to Ethereum wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                    components={[<a key={0} className='link link--orange' onClick={handleLearnMore} />]}
                />
            </p>
            <Modal
                className='usdt-note-modal'
                title={<Localize i18n_default_text='About Tether' />}
                has_close_icon
                is_open={is_modal_open}
                small
                toggleModal={handleLearnMore}
            >
                <Modal.Body>
                    <p>
                        <Localize i18n_default_text='Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.' />
                    </p>
                    <li className='title'>
                        <Localize i18n_default_text='Tether on Omni Layer (USDT)' />
                    </li>
                    <p className='description'>
                        <Localize i18n_default_text='Tether was originally created to use the bitcoin network as its transport protocol -- specifically, the Omni Layer -- to allow transactions of tokenised traditional currency.' />
                    </p>
                    <li className='title'>
                        <Localize i18n_default_text='Tether on Ethereum (eUSDT)' />
                    </li>
                    <p className='description'>
                        <Localize i18n_default_text='Tether on the Ethereum blockchain, as an ERC20 token, is a newer transport layer, which now makes Tether available in Ethereum smart contracts. As a standard ERC20 token, it can also be sent to any Ethereum address.' />
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default USDTSideNote;
