import React from 'react';
import { Modal, SideNote, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const DepositCryptoSideNoteUSDT: React.FC = () => {
    const [is_modal_open, setModalOpen] = React.useState(false);

    return (
        <SideNote
            title={localize('About Tether (Omni)')}
            description={
                <Localize
                    i18n_default_text='Deriv currently supports withdrawals of Tether USDT to Omni wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                    components={[<a key={0} className='link link--orange' onClick={() => setModalOpen(true)} />]}
                />
            }
        >
            <Modal
                title={<Localize i18n_default_text='About Tether' />}
                has_close_icon
                is_open={is_modal_open}
                small
                toggleModal={() => setModalOpen(old => !old)}
            >
                <Modal.Body>
                    <Text size='xs'>
                        {localize(
                            'Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.'
                        )}
                    </Text>
                    <li>{localize('Tether on Omni Layer (USDT)')}</li>
                    <Text size='xs'>
                        {localize(
                            'Tether was originally created to use the bitcoin network as its transport protocol ‒ specifically, the Omni Layer ‒ to allow transactions of tokenised traditional currency.'
                        )}
                    </Text>
                </Modal.Body>
            </Modal>
        </SideNote>
    );
};

export default DepositCryptoSideNoteUSDT;
