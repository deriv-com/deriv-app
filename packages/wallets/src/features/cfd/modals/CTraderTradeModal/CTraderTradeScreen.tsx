import React, { FC, useMemo } from 'react';
import { useActiveWalletAccount, useCtraderAccountsList, useDxtradeAccountsList } from '@deriv/api-v2';
import { LabelPairedCircleExclamationMdFillIcon } from '@deriv/quill-icons';
import { WalletListCardBadge } from '../../../../components';
import { InlineMessage, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import { CFD_PLATFORMS, MarketTypeDetails, PlatformDetails, serviceMaintenanceMessages } from '../../constants';

type MT5TradeScreenProps = {
    mt5Account?: THooks.MT5AccountsList;
};

const MT5TradeScreen: FC<MT5TradeScreenProps> = ({ mt5Account }) => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeWalletData } = useActiveWalletAccount();

    const mt5Platform = CFD_PLATFORMS.MT5;
    const dxtradePlatform = CFD_PLATFORMS.DXTRADE;
    const ctraderPlatform = CFD_PLATFORMS.CTRADER;

    const marketType = getModalState('marketType');
    const platform = getModalState('platform') ?? mt5Platform;

    const { icon: platformIcon, title: platformTitle } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const { icon: marketTypeIcon, title: marketTypeTitle } =
        MarketTypeDetails[(marketType as keyof typeof MarketTypeDetails) ?? 'all'];

    const platformToAccountsListMapper = useMemo(
        () => ({
            ctrader: ctraderAccountsList,
            dxtrade: dxtradeAccountsList,
            mt5: [mt5Account],
        }),
        [ctraderAccountsList, dxtradeAccountsList, mt5Account]
    );

    const shouldShowAccountBalance = useMemo(() => {
        if (
            platform === mt5Platform &&
            platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0]?.status ===
                'migrated_without_position'
        )
            return false;
        return true;
    }, [marketType, mt5Platform, platform, platformToAccountsListMapper.mt5]);

    const details = useMemo(() => {
        return platform === mt5Platform
            ? platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0]
            : platformToAccountsListMapper.dxtrade?.[0];
    }, [platform, mt5Platform, platformToAccountsListMapper.mt5, platformToAccountsListMapper.dxtrade, marketType]);

    const loginId = useMemo(() => {
        if (platform === mt5Platform) {
            return (details as THooks.MT5AccountsList)?.display_login;
        } else if (platform === dxtradePlatform) {
            return (details as THooks.DxtradeAccountsList)?.account_id;
        }
        return details?.login;
    }, [details, dxtradePlatform, mt5Platform, platform]);

    const migrationMessage = useMemo(() => {
        if (platform === mt5Platform && !activeWalletData?.is_virtual) {
            switch (
                platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0]?.status
            ) {
                case 'migrated_with_position':
                    return (
                        <InlineMessage size='sm' type='warning' variant='outlined'>
                            <WalletText color='warning' size='2xs' weight='bold'>
                                No new positions
                            </WalletText>
                        </InlineMessage>
                    );
                case 'migrated_without_position':
                    return (
                        <InlineMessage size='sm' type='warning' variant='outlined'>
                            <WalletText color='warning' size='2xs' weight='bold'>
                                Account closed
                            </WalletText>
                        </InlineMessage>
                    );
                default:
                    return null;
            }
        }
    }, [activeWalletData?.is_virtual, marketType, mt5Platform, platform, platformToAccountsListMapper.mt5]);

    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details-description'>
                    <div className='wallets-mt5-trade-screen__details-description__icon'>
                        {platform === mt5Platform ? marketTypeIcon : platformIcon}
                    </div>
                    <div className='wallets-mt5-trade-screen__details-description__details'>
                        <div className='wallets-mt5-trade-screen__label'>
                            <WalletText lineHeight='3xs' size={isDesktop ? 'sm' : 'md'}>
                                {platform === mt5Platform ? marketTypeTitle : platformTitle}{' '}
                                {!activeWalletData?.is_virtual && details?.landing_company_short?.toUpperCase()}
                            </WalletText>
                            {activeWalletData?.is_virtual && <WalletListCardBadge isDemo label='virtual' />}
                        </div>
                        <WalletText color='less-prominent' size='xs'>
                            {platform !== ctraderPlatform && loginId}
                        </WalletText>
                    </div>
                    <div className='wallets-mt5-trade-screen__details-description__balance'>
                        {shouldShowAccountBalance && <WalletText weight='bold'>{details?.display_balance}</WalletText>}
                        {migrationMessage}
                    </div>
                </div>

                <div className='wallets-mt5-trade-screen__details-clipboards'>
                    {/* <MT5TradeDetailsItem
                        value=' Use your Deriv account email and password to login into the cTrader platform.'
                        variant='info'
                    /> */}
                </div>

                <div className='wallets-mt5-trade-screen__details-maintenance'>
                    <LabelPairedCircleExclamationMdFillIcon fill='#FFAD3A' />
                    <WalletText color='less-prominent' size={isDesktop ? '2xs' : 'xs'}>
                        {
                            serviceMaintenanceMessages[
                                (platform as keyof typeof serviceMaintenanceMessages) ?? PlatformDetails.mt5.platform
                            ]
                        }
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

export default MT5TradeScreen;
