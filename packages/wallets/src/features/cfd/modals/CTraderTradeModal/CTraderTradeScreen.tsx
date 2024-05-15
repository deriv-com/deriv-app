import React from 'react';
import { useAvailableCTraderAccounts, useCtraderAccountsList } from '@deriv/api-v2';
import { LabelPairedCircleExclamationMdFillIcon } from '@deriv/quill-icons';
import { WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { CFD_PLATFORMS, PlatformDetails } from '../../constants';

const CTraderTradeScreen = () => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const ctraderPlatform = CFD_PLATFORMS.CTRADER;
    const platform = getModalState('platform') ?? ctraderPlatform;
    const { icon: platformIcon, title: platformTitle } = PlatformDetails[platform];

    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: availableCtraderAccounts } = useAvailableCTraderAccounts();
    const availableAccount = availableCtraderAccounts?.[0];

    const totalBalance = ctraderAccountsList?.reduce((acc, cur) => acc + +(cur?.display_balance || 0), 0);

    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details-description'>
                    <div className='wallets-mt5-trade-screen__details-description__icon'>{platformIcon}</div>
                    <div className='wallets-mt5-trade-screen__details-description__details'>
                        <div className='wallets-mt5-trade-screen__label'>
                            <WalletText lineHeight='3xs' size={isDesktop ? 'sm' : 'md'}>
                                {platformTitle}
                            </WalletText>
                        </div>
                    </div>
                    <div className='wallets-mt5-trade-screen__details-description__balance'>
                        <WalletText as='p' lineHeight='3xs' size={isDesktop ? 'sm' : 'md'}>
                            Total balance:
                        </WalletText>
                        <WalletText as='p' weight='bold'>
                            {totalBalance}
                        </WalletText>
                    </div>
                </div>
                <ul className='list'>
                    {ctraderAccountsList?.map(account => (
                        <li key={account.login}>
                            <span>{account.login}</span>
                            <span>{account.formatted_balance}</span>
                        </li>
                    ))}
                </ul>

                {availableAccount?.available_count !== undefined &&
                    availableAccount?.max_count !== undefined &&
                    availableAccount.available_count < availableAccount.max_count && (
                        <button>Get another cTrader account</button>
                    )}

                <div className='wallets-mt5-trade-screen__details-clipboards'>
                    {/* <MT5TradeDetailsItem
                        value=' Use your Deriv account email and password to login into the cTrader platform.'
                        variant='info'
                    /> */}
                </div>

                <div className='wallets-mt5-trade-screen__details-maintenance'>
                    <LabelPairedCircleExclamationMdFillIcon fill='#FFAD3A' />
                    <WalletText color='less-prominent' size={isDesktop ? '2xs' : 'xs'}>
                        dsfddf
                    </WalletText>
                </div>
            </div>
            <div className='wallets-mt5-trade-screen__links'>
                {/* <MT5TradeLink platform={ctraderPlatform} />
                <MT5TradeLink app={ctraderPlatform} platform={ctraderPlatform} /> */}
            </div>
        </div>
    );
};

export default CTraderTradeScreen;
