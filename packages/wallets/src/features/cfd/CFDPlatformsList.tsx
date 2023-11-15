import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { ModalStepWrapper, WalletButton, WalletText } from '../../components/Base';
import { useModal } from '../../components/ModalProvider';
import useDevice from '../../hooks/useDevice';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from './components';
import { ResubmitPOA } from './screens';
import './CFDPlatformsList.scss';

type TProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const CFDPlatformsList: React.FC<TProps> = ({ onMT5PlatformListLoaded }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const { show } = useModal();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {!isMobile && (
                    <WalletText size='xl' weight='bold'>
                        <h1>CFDs</h1>
                    </WalletText>
                )}
                <div className='wallets-cfd-list__header-description'>
                    <h1>
                        Trade with leverage and tight spreads for better returns on trades.{' '}
                        <a
                            className='wallets-cfd-list__header-description__link'
                            // href='https://deriv.com/trade-types/cfds/'
                            onClick={() =>
                                show(
                                    <ModalStepWrapper
                                        closeOnEscape
                                        renderFooter={() => <WalletButton text='Next' />}
                                        title='Add a real MT5 account'
                                    >
                                        <ResubmitPOA />
                                    </ModalStepWrapper>
                                )
                            }
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            Learn more
                        </a>
                    </h1>
                </div>
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
