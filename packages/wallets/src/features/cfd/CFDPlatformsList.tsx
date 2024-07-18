import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletButton, WalletLink, WalletText } from '../../components/Base';
import useDevice from '../../hooks/useDevice';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CFDPlatformsListAccounts } from './components';
import './CFDPlatformsList.scss';

const CFDPlatformsList: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const { t } = useTranslation();
    const history = useHistory();
    const CFDsDescription =
        'Trade bigger positions with less capital on a wide range of global markets. <0>Learn more</0>';

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {isMobile ? (
                    <div className='wallets-cfd-list__header-description'>
                        <WalletText size='sm'>
                            <Trans
                                components={[
                                    <a
                                        className='wallets-cfd-list__header-description__link'
                                        href='https://deriv.com/trade-types/cfds/'
                                        key={0}
                                        rel='noopener noreferrer'
                                        target='_blank'
                                    />,
                                ]}
                                defaults={CFDsDescription}
                            />
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
                ) : (
                    <div>
                        <div className='wallets-cfd-list__header-compare-accounts'>
                            <WalletText size='xl' weight='bold'>
                                {t('CFDs')}
                            </WalletText>
                            <WalletButton
                                onClick={() => {
                                    history.push('/compare-accounts');
                                }}
                                size='sm'
                                variant='ghost'
                            >
                                {t('Compare accounts')}
                            </WalletButton>
                        </div>
                        <WalletText size='md'>
                            <Trans
                                components={[<WalletLink key={0} staticUrl='/trade-types/cfds/' />]}
                                defaults={CFDsDescription}
                            />
                        </WalletText>
                    </div>
                )}
            </section>
            {activeWallet?.currency_config?.is_crypto ? <CFDPlatformsListEmptyState /> : <CFDPlatformsListAccounts />}
        </div>
    );
};

export default CFDPlatformsList;
