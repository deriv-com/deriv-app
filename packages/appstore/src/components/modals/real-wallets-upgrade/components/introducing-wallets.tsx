import React from 'react';
import { Modal, Button, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import '../real-wallets-upgrade.scss';
import TradingPlatformIcon from 'Assets/wallets';

type StepProps = {
    onNext?: () => void;
    onClose?: () => void;
    eu_user?: boolean;
};

const IntroducingWallets = ({ onNext, onClose, eu_user }: StepProps) => {
    return (
        <React.Fragment>
            <Modal.Body className='introducing-wallets'>
                <div className='introducing-wallets--content'>
                    <TradingPlatformIcon icon={eu_user ? 'IntroducingWalletsEU' : 'IntroducingWallets'} />
                    <Text
                        as='h1'
                        color='prominent'
                        weight='bold'
                        align='center'
                        size='l'
                        className='introducing-wallets--title'
                    >
                        {localize('Introducing Wallets')}
                    </Text>
                    <Text as='p' color='prominent' size='m' className='introducing-wallets--description'>
                        {localize('A better way to manage your funds')}
                    </Text>
                    <div className='introducing-wallets--bullet'>
                        <Icon icon='IcAppstoreTick' />
                        <Text as='p' color='prominent' align='center' className='introducing-wallets--bullet--text'>
                            {localize('One Wallet, one currency')}
                        </Text>
                    </div>
                    <div className='introducing-wallets--bullet'>
                        <Icon icon='IcAppstoreTick' />
                        <Text as='p' color='prominent' className='introducing-wallets--bullet--text'>
                            {localize('A Wallet for each currency to focus your funds')}
                        </Text>
                    </div>
                    {!eu_user && (
                        <div className='introducing-wallets--bullet'>
                            <Icon icon='IcAppstoreTick' />
                            <Text as='p' color='prominent' className='introducing-wallets--bullet--text'>
                                {localize('Get one Wallet, get several - your choice')}
                            </Text>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect onClick={onClose} text={localize('Maybe later')} secondary large />
                <Button has_effect onClick={onNext} text={localize('Next')} primary large />
            </Modal.Footer>
        </React.Fragment>
    );
};

export default IntroducingWallets;
