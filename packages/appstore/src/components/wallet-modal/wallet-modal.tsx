import React from 'react';
import { Text } from '@deriv/components';
import { useStores } from 'Stores';
import { Button, Modal } from '@deriv/ui';
import { localize, Localize } from '@deriv/translations';
import WalletCard from 'Components/wallet';
import './wallet-modal.scss';

type ContentProp = {
    setIsOpen: (open: boolean) => void;
};

type WalletModalProps = ContentProp & {
    is_open: boolean;
};

const Content = ({ setIsOpen }: ContentProp) => {
    const { wallet_store } = useStores();

    return (
        <div className='wallet-modal__content'>
            <div className='wallet-modal__wallet'>
                <WalletCard size='large' wallet_name={wallet_store.selected_wallet_name} balance='0.00' />
            </div>
            <Text bold={false} type='paragraph-2'>
                {
                    <Localize
                        i18n_default_text='You have added a {{currency}} wallet.'
                        values={{ currency: wallet_store.selected_wallet_name.toUpperCase() }}
                    />
                }
            </Text>
            <Button className='wallet-modal__button' color='secondary' size='medium' onClick={() => setIsOpen(false)}>
                {<Localize i18n_default_text={'Back to Trading Hub'} />}
            </Button>
        </div>
    );
};

const WalletModal = ({ is_open, setIsOpen }: WalletModalProps) => {
    return (
        <Modal open={is_open} onOpenChange={setIsOpen}>
            <Modal.Portal>
                <Modal.Overlay />
                <Modal.PageContent title={localize('Wallet added')} has_close_button has_title_separator>
                    <Content setIsOpen={setIsOpen} />
                </Modal.PageContent>
            </Modal.Portal>
        </Modal>
    );
};

export default WalletModal;
