import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Button } from '@deriv-com/ui';
import { WalletLink, WalletText } from '../../components/Base';
import useDevice from '../../hooks/useDevice';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CFDPlatformsListAccounts } from './components';
import './CFDPlatformsList.scss';

const CFDPlatformsList: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {isMobile ? (
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
                        <Button
                            onClick={() => {
                                history.push('/compare-accounts');
                            }}
                            size='sm'
                            textSize='sm'
                            variant='ghost'
                        >
                            Compare accounts
                        </Button>
                    </div>
                ) : (
                    <div>
                        <div className='wallets-cfd-list__header-compare-accounts'>
                            <WalletText size='xl' weight='bold'>
                                CFDs
                            </WalletText>
                            <Button
                                onClick={() => {
                                    history.push('/compare-accounts');
                                }}
                                size='sm'
                                variant='ghost'
                            >
                                Compare accounts
                            </Button>
                        </div>
                        <WalletText size='md'>
                            Trade bigger positions with less capital on a wide range of global markets.{' '}
                            <WalletLink key={0} staticUrl='/trade-types/cfds/'>
                                Learn more
                            </WalletLink>
                        </WalletText>
                    </div>
                )}
            </section>
            {activeWallet?.currency_config?.is_crypto ? <CFDPlatformsListEmptyState /> : <CFDPlatformsListAccounts />}
        </div>
    );
};

export default CFDPlatformsList;
