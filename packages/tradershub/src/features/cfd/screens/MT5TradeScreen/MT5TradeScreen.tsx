import React, { FC, Fragment, useMemo } from 'react';
import { useActiveAccount, useCtraderAccountsList, useDxtradeAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Text, useBreakpoint } from '@deriv/quill-design';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import { THooks, TPlatforms } from '../../../../types';
import { MarketTypeDetails, PlatformDetails } from '../../constants';
import { MT5TradeDetailsItem } from './MT5TradeDetailsItem';
import { MT5TradeLink } from './MT5TradeLink';

type MT5TradeScreenProps = {
    mt5Account?: THooks.MT5AccountsList;
};

const serviceMaintenanceMessages: Record<TPlatforms.All, string> = {
    ctrader:
        'Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.',
    dxtrade:
        'Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.',
    mt5: 'Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.',
};

const MT5TradeScreen: FC<MT5TradeScreenProps> = ({ mt5Account }) => {
    const { isDesktop } = useBreakpoint();
    const { getModalState } = Provider.useModal();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeData } = useActiveAccount();

    const mt5Platform = PlatformDetails.mt5.platform;
    const dxtradePlatform = PlatformDetails.dxtrade.platform;
    const ctraderPlatform = PlatformDetails.ctrader.platform;

    const marketType = getModalState('marketType');
    const platform = getModalState('platform') ?? mt5Platform;

    const platformToAccountsListMapper = useMemo(
        () => ({
            ctrader: ctraderAccountsList,
            dxtrade: dxtradeAccountsList,
            mt5: [mt5Account],
        }),
        [ctraderAccountsList, dxtradeAccountsList, mt5Account]
    );

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

    const showNoNewPositionsMessage = useMemo(() => {
        return (
            !activeData?.is_virtual &&
            details?.landing_company_short === 'svg' &&
            ['synthetic', 'financial'].includes(marketType ?? '') && (
                // <InlineMessage type='warning' variant='outlined'>
                <p>No new positions</p>
                // </InlineMessage>
            )
        );
    }, [activeData?.is_virtual, details?.landing_company_short, marketType]);

    return (
        <div className='lg:w-[45vw] lg:min-w-[51.2rem] lg:max-w-[60rem] w-full min-w-full h-auto'>
            <div className='flex flex-col p-1200 gap-800'>
                <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                        {platform === mt5Platform
                            ? MarketTypeDetails[marketType ?? 'all'].icon
                            : PlatformDetails[platform].icon}
                        <div className='flex flex-col'>
                            <div className='flex items-center flex-row gap-300'>
                                {/* <WalletText lineHeight='3xs' size='sm'> */}
                                <Text>
                                    {platform === mt5Platform
                                        ? MarketTypeDetails[marketType ?? 'all'].title
                                        : PlatformDetails[platform].title}{' '}
                                    {!activeData?.is_virtual && details?.landing_company_short?.toUpperCase()}
                                    {/* </WalletText> */}
                                </Text>
                                {/* {activeWalletData?.is_virtual && <WalletListCardBadge isDemo label='virtual' />} */}
                            </div>
                            {/* <WalletText color='less-prominent' size='xs'> */}
                            <Text>{loginId}</Text>
                            {/* </WalletText> */}
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        {/* <WalletText weight='bold'>{details?.display_balance}</WalletText> */}
                        <Text weight='bold'>{details?.display_balance}</Text>
                        {showNoNewPositionsMessage}
                    </div>
                </div>
                <div className='flex flex-col gap-100'>
                    {/* <div className='wallets-mt5-trade-screen__details-clipboards'> */}
                    {getModalState('platform') === mt5Platform && (
                        <Fragment>
                            <MT5TradeDetailsItem label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                            <MT5TradeDetailsItem
                                label='Server'
                                value={details?.server_info?.environment ?? 'Deriv-Server'}
                            />
                            <MT5TradeDetailsItem label='Login ID' value={loginId ?? '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </Fragment>
                    )}
                    {getModalState('platform') === dxtradePlatform && (
                        <Fragment>
                            <MT5TradeDetailsItem label='Username' value={details?.login ?? '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </Fragment>
                    )}
                    {getModalState('platform') === ctraderPlatform && (
                        <MT5TradeDetailsItem
                            value=' Use your Deriv account email and password to login into the cTrader platform.'
                            variant='info'
                        />
                    )}
                </div>
                <div className='grid grid-cols-[2.5rem_auto]'>
                    <ImportantIcon />
                    {/* <WalletText color='less-prominent' size='2xs'> */}
                    <Text>{serviceMaintenanceMessages[platform || mt5Platform]}</Text>
                    {/* </WalletText> */}
                </div>
            </div>
            <div className='w-full'>
                {platform === mt5Platform && (
                    <Fragment>
                        <MT5TradeLink
                            app='web'
                            platform={mt5Platform}
                            webtraderUrl={(details as THooks.MT5AccountsList)?.webtrader_url}
                        />
                        {isDesktop && (
                            <Fragment>
                                <MT5TradeLink app='windows' platform={mt5Platform} />
                                <MT5TradeLink app='macos' platform={mt5Platform} />
                                <MT5TradeLink app='linux' platform={mt5Platform} />
                            </Fragment>
                        )}
                    </Fragment>
                )}
                {platform === dxtradePlatform && (
                    <MT5TradeLink isDemo={activeData?.is_virtual} platform={dxtradePlatform} />
                )}
                {platform === ctraderPlatform && (
                    <Fragment>
                        <MT5TradeLink platform={ctraderPlatform} />
                        <MT5TradeLink app={ctraderPlatform} platform={ctraderPlatform} />
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default MT5TradeScreen;
