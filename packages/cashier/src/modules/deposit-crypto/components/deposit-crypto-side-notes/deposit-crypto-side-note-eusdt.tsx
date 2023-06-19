import React from 'react';
import { Modal, SideNote, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const DepositCryptoSideNoteeUSDT: React.FC = () => {
    const [is_modal_open, setModalOpen] = React.useState(false);

    return (
        <SideNote
            title={localize('About Tether (Ethereum)')}
            description={
                <Localize
                    i18n_default_text='Deriv currently supports withdrawals of Tether eUSDT to Ethereum wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
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
                    <br />
                    <br />
                    <Text as='li' size='xs' weight='bold'>
                        {localize('Tether on Ethereum (eUSDT)')}
                    </Text>
                    <Text as='ul' size='xs' style={{ paddingLeft: '2rem' }}>
                        {localize(
                            'Tether on the Ethereum blockchain, as an ERC20 token, is a newer transport layer, which now makes Tether available in Ethereum smart contracts. As a standard ERC20 token, it can also be sent to any Ethereum address.'
                        )}
                    </Text>
                </Modal.Body>
            </Modal>
        </SideNote>
    );
};

export default DepositCryptoSideNoteeUSDT;
