import React, { useMemo } from 'react';
import { Modal, SideNote, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

type TProps = {
    currency: 'eUSDT' | 'USDT';
};

const DepositCryptoSideNoteUSDT: React.FC<TProps> = ({ currency }) => {
    const [is_modal_open, setModalOpen] = React.useState(false);

    const currency_content_mapper = useMemo(
        () => ({
            eUSDT: {
                side_note_title: localize('About Tether (Ethereum)'),
                side_note_description: (
                    <Localize
                        i18n_default_text='Deriv currently supports withdrawals of Tether eUSDT to Ethereum wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                        components={[<a key={0} className='link link--orange' onClick={() => setModalOpen(true)} />]}
                    />
                ),
                modal_title: localize('About Tether'),
                modal_header: localize(
                    'Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.'
                ),
                modal_bullet: localize('Tether on Ethereum (eUSDT)'),
                modal_description: localize(
                    'Tether on the Ethereum blockchain, as an ERC20 token, is a newer transport layer, which now makes Tether available in Ethereum smart contracts. As a standard ERC20 token, it can also be sent to any Ethereum address.'
                ),
            },
            USDT: {
                side_note_title: localize('About Tether (Omni)'),
                side_note_description: (
                    <Localize
                        i18n_default_text='Deriv currently supports withdrawals of Tether USDT to Omni wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                        components={[<a key={0} className='link link--orange' onClick={() => setModalOpen(true)} />]}
                    />
                ),
                modal_title: localize('About Tether'),
                modal_header: localize(
                    'Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.'
                ),
                modal_bullet: localize('Tether on Omni Layer (USDT)'),
                modal_description: localize(
                    'Tether was originally created to use the bitcoin network as its transport protocol ‒ specifically, the Omni Layer ‒ to allow transactions of tokenised traditional currency.'
                ),
            },
        }),
        []
    );

    const content = currency_content_mapper[currency];

    return (
        <SideNote title={content.side_note_title} description={content.side_note_description}>
            <Modal
                title={content.modal_title}
                has_close_icon
                is_open={is_modal_open}
                small
                toggleModal={() => setModalOpen(old => !old)}
            >
                <Modal.Body className='deposit-crypto-side-notes__modal-body'>
                    <Text size='xs'>{content.modal_header}</Text>
                    <br />
                    <br />
                    <Text as='li' size='xs' weight='bold'>
                        {content.modal_bullet}
                    </Text>
                    <Text as='ul' size='xs' className='deposit-crypto-side-notes__modal-bullet'>
                        {content.modal_description}
                    </Text>
                </Modal.Body>
            </Modal>
        </SideNote>
    );
};

export default DepositCryptoSideNoteUSDT;
