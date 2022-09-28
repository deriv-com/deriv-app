import React from 'react';
import { Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './usdt-side-note.scss';

type TUSDTSideNoteProps = {
    type: 'eusdt' | 'usdt';
};

const USDTSideNote = ({ type }: TUSDTSideNoteProps) => {
    const [is_modal_open, setModalOpen] = React.useState(false);

    const handleLearnMore = () => {
        setModalOpen(!is_modal_open);
    };

    return (
        <div className='cashier__usdt-side-note'>
            <Text as='h2' weight='bold' color='prominent'>
                {type === 'eusdt' && <Localize i18n_default_text='About Tether (Ethereum)' />}
                {type === 'usdt' && <Localize i18n_default_text='About Tether (Omni)' />}
            </Text>
            {type === 'eusdt' && (
                <Text as='p' size='xxs'>
                    <Localize
                        i18n_default_text='Deriv currently supports withdrawals of Tether eUSDT to Ethereum wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                        components={[<a key={0} className='link link--orange' onClick={handleLearnMore} />]}
                    />
                </Text>
            )}
            {type === 'usdt' && (
                <Text as='p' size='xxs'>
                    <Localize
                        i18n_default_text='Deriv currently supports withdrawals of Tether USDT to Omni wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw. <0>Learn more</0>'
                        components={[<a key={0} className='link link--orange' onClick={handleLearnMore} />]}
                    />
                </Text>
            )}
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
                    {type === 'eusdt' && (
                        <div>
                            <li className='title'>
                                <Localize i18n_default_text='Tether on Ethereum (eUSDT)' />
                            </li>
                            <Text as='p' size='xs' className='description'>
                                <Localize i18n_default_text='Tether on the Ethereum blockchain, as an ERC20 token, is a newer transport layer, which now makes Tether available in Ethereum smart contracts. As a standard ERC20 token, it can also be sent to any Ethereum address.' />
                            </Text>
                        </div>
                    )}
                    {type === 'usdt' && (
                        <div>
                            <li className='title'>
                                <Localize i18n_default_text='Tether on Omni Layer (USDT)' />
                            </li>
                            <Text as='p' className='description' size='xs'>
                                <Localize i18n_default_text='Tether was originally created to use the bitcoin network as its transport protocol ‒ specifically, the Omni Layer ‒ to allow transactions of tokenised traditional currency.' />
                            </Text>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default USDTSideNote;
