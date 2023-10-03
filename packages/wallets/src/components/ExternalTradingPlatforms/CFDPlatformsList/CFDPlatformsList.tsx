import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../../hooks/useDevice';
import { CTraderList } from '../CTraderList';
import { MT5PlatformsList } from '../MT5PlatformsList';
import { OtherCFDPlatformsList } from '../OtherCFDPlatformsList';
import './CFDPlatformsList.scss';
import { MT5AccountTypeModal } from '../../MT5AccountTypeModal';
import { useModal } from '../../ModalProvider';

const CFDPlatformsList = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const { show } = useModal();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {!isMobile && (
                    <div className='wallets-cfd-list__header-title'>
                        <h1>CFDs</h1>
                    </div>
                )}
                <div className='wallets-cfd-list__header-description'>
                    <h1>
                        Trade with leverage and tight spreads for better returns on trades.{' '}
                        <a
                            className='wallets-cfd-list__header-description__link'
                            href='#'
                            onClick={() => show(<MT5AccountTypeModal />)}
                        >
                            Learn more
                        </a>
                    </h1>
                </div>
            </section>
            <MT5PlatformsList />
            {activeWallet?.is_virtual && <CTraderList />}
            <OtherCFDPlatformsList />
        </div>
    );
};

export default CFDPlatformsList;
