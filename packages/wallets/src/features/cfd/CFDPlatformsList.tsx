import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletButton, WalletText } from '../../components/Base';
import useDevice from '../../hooks/useDevice';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from './components';
import './CFDPlatformsList.scss';

type TProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const CFDPlatformsList: React.FC<TProps> = ({ onMT5PlatformListLoaded }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {isMobile ? (
                    <div className='wallets-cfd-list__header-description'>
                        <WalletText size='sm'>
                            Trade with leverage and tight spreads for better returns on trades.{' '}
                            <a
                                className='wallets-cfd-list__header-description__link'
                                href='https://deriv.com/trade-types/cfds/'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                Learn more
                            </a>
                        </WalletText>
                        <WalletButton size='sm' text='Compare accounts' textSize='sm' variant='ghost' />
                    </div>
                ) : (
                    <div>
                        <div className='wallets-cfd-list__header-compare-accounts'>
                            <WalletText size='xl' weight='bold'>
                                CFDs
                            </WalletText>
                            <WalletButton size='sm' text='Compare accounts' variant='ghost' />
                        </div>
                        <WalletText size='md'>
                            Trade with leverage and tight spreads for better returns on trades.{' '}
                            <a
                                className='wallets-cfd-list__header-description__link'
                                href='https://deriv.com/trade-types/cfds/'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                Learn more
                            </a>
                        </WalletText>
                    </div>
                )}
            </section>
            {activeWallet?.currency_config?.is_crypto ? (
                <CFDPlatformsListEmptyState />
            ) : (
                <React.Fragment>
                    <MT5PlatformsList onMT5PlatformListLoaded={onMT5PlatformListLoaded} />
                    {activeWallet?.is_virtual && <CTraderList />}
                    <OtherCFDPlatformsList />
                </React.Fragment>
            )}
        </div>
    );
};

export default CFDPlatformsList;
