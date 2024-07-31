import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { WalletButton, WalletLink, WalletText } from '../../components/Base';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CFDPlatformsListAccounts } from './components';
import './CFDPlatformsList.scss';

const CFDPlatformsList: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {isDesktop ? (
                    <React.Fragment>
                        <div className='wallets-cfd-list__header-compare-accounts'>
                            <WalletText size='xl' weight='bold'>
                                CFDs
                            </WalletText>
                            <WalletButton
                                onClick={() => {
                                    history.push('/compare-accounts');
                                }}
                                size='sm'
                                variant='ghost'
                            >
                                Compare accounts
                            </WalletButton>
                        </div>
                        <WalletText size='md'>
                            Trade bigger positions with less capital on a wide range of global markets.{' '}
                            <WalletLink key={0} staticUrl='/trade-types/cfds/'>
                                Learn more
                            </WalletLink>
                        </WalletText>
                    </React.Fragment>
                ) : (
                    <div className='wallets-cfd-list__header-description'>
                        <WalletText size='sm'>
                            Trade bigger positions with less capital on a wide range of global markets.{' '}
                            <a
                                className='wallets-cfd-list__header-description__link'
                                href='https://deriv.com/trade-types/cfds/'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                Learn more
                            </a>
                        </WalletText>
                        <WalletButton
                            onClick={() => {
                                history.push('/compare-accounts');
                            }}
                            size='sm'
                            textSize='sm'
                            variant='ghost'
                        >
                            Compare accounts
                        </WalletButton>
                    </div>
                )}
            </section>
            {activeWallet?.currency_config?.is_crypto ? <CFDPlatformsListEmptyState /> : <CFDPlatformsListAccounts />}
        </div>
    );
};

export default CFDPlatformsList;
