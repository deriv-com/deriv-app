import React from 'react';
import { Modal, Text } from '@deriv/components';
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
            <Text as='p' size='xxs'>
                <Localize
                    i18n_default_text='Deriv currently supports withdrawals of Tether USDT to Omni wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                    components={[<a key={0} className='link link--orange' onClick={handleLearnMore} />]}
                />
            </Text>
            <Modal
                className='usdt-note-modal'
                title={<Localize i18n_default_text='About Tether' />}
                has_close_icon
                is_open={is_modal_open}
                small
                toggleModal={handleLearnMore}
            >
                <Modal.Body>
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.' />
                    </Text>
                    <li className='title'>
                        <Localize i18n_default_text='Tether on Omni Layer (USDT)' />
                    </li>
                    <Text as='p' className='description' size='xs'>
                        <Localize i18n_default_text='Tether was originally created to use the bitcoin network as its transport protocol ‒ specifically, the Omni Layer ‒ to allow transactions of tokenised traditional currency.' />
                    </Text>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default USDTSideNote;
