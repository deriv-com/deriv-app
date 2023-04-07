import React from 'react';

import { Modal, Button, Text, Icon, Div100vhContainer } from '@deriv/components';
import { localize } from '@deriv/translations';
import '../real-wallets-upgrade.scss';
import TradingPlatformIcon from 'Assets/wallets';
import { isDesktop } from '@deriv/shared';

type StepProps = {
    onBack?: () => void;
    onClose?: () => void;
    eu_user?: boolean;
};

const TradingAccountsWallets = ({ onClose, onBack, eu_user }: StepProps) => {
    return (
        <React.Fragment>
            <Modal.Body className='introducing-wallets'>
                <Div100vhContainer is_disabled={isDesktop()} height_offset='15rem'>
                    <div className='introducing-wallets--content'>
                        <TradingPlatformIcon icon='TradingAccounts' />
                        <Text
                            as='h1'
                            color='prominent'
                            weight='bold'
                            align='center'
                            size='l'
                            className='introducing-wallets--title'
                        >
                            {localize('What happens to my trading accounts')}
                        </Text>
                        <Text
                            as='p'
                            color='prominent'
                            size='m'
                            align='center'
                            className='introducing-wallets--description'
                        >
                            {localize("We'll link them")}
                        </Text>
                        <div className='introducing-wallets--bullet'>
                            <Icon icon='IcAppstoreTick' />
                            <Text as='p' color='prominent' align='center' className='introducing-wallets--bullet--text'>
                                {localize(
                                    "We'll connect your existing trading accounts of the same currency to your new Wallet"
                                )}
                            </Text>
                        </div>
                        {!eu_user && (
                            <div className='introducing-wallets--bullet'>
                                <Icon icon='IcAppstoreTick' />
                                <Text as='p' color='prominent' className='introducing-wallets--bullet--text'>
                                    {localize(
                                        'For example, all your USD trading account(s) will be linked to your USD Wallet'
                                    )}
                                </Text>
                            </div>
                        )}
                    </div>
                </Div100vhContainer>
            </Modal.Body>
        </React.Fragment>
    );
};

export default TradingAccountsWallets;
