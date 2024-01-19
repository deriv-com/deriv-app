import React, { Fragment, useMemo } from 'react';
import { useActiveTradingAccount, useCtraderAccountsList, useDxtradeAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Text, useBreakpoint } from '@deriv/quill-design';
import { useUIContext } from '../../../../components';
import useRegulationFlags from '../../../../hooks/useRegulationFlags';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import { THooks, TPlatforms } from '../../../../types';
import { AppToContentMapper, MarketType, MarketTypeDetails, PlatformDetails } from '../../constants';
import { TradeDetailsItem } from './TradeDetailsItem';
import { TradeLink } from './TradeLink';

type TradeScreenProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
};

const serviceMaintenanceMessages: Record<TPlatforms.All, string> = {
    ctrader:
        'Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.',
    dxtrade:
        'Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.',
    mt5: 'Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.',
};

const TradeScreen = ({ account }: TradeScreenProps) => {
    const { isMobile } = useBreakpoint();
    const { getUIState } = useUIContext();
    const activeRegulation = getUIState('regulation');
    const { isEU } = useRegulationFlags(activeRegulation);

    const { getCFDState } = Provider.useCFDContext();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeAccount } = useActiveTradingAccount();

    const mt5Platform = PlatformDetails.mt5.platform;
    const dxtradePlatform = PlatformDetails.dxtrade.platform;
    const ctraderPlatform = PlatformDetails.ctrader.platform;

    const marketType = getCFDState('marketType');
    const platform = getCFDState('platform') ?? mt5Platform;

    const platformToAccountsListMapper = useMemo(
        () => ({
            ctrader: ctraderAccountsList?.find(account => account.is_virtual === activeAccount?.is_virtual),
            dxtrade: dxtradeAccountsList?.find(account => account.is_virtual === activeAccount?.is_virtual),
            mt5: account,
        }),
        [ctraderAccountsList, dxtradeAccountsList, account, activeAccount?.is_virtual]
    );

    const details = platformToAccountsListMapper[platform as TPlatforms.All];

    const loginId = useMemo(() => {
        if (platform === mt5Platform) {
            return (details as THooks.MT5AccountsList)?.display_login;
        } else if (platform === dxtradePlatform) {
            return (details as THooks.DxtradeAccountsList)?.account_id;
        }
        return (details as THooks.CtraderAccountsList)?.login;
    }, [details, dxtradePlatform, mt5Platform, platform]);

    const marketTypeDetails = MarketTypeDetails(isEU);

    return (
        <div className='lg:w-[45vw] lg:min-w-[512px] lg:max-w-[600px] w-full min-w-full h-auto'>
            <div className='flex flex-col p-1200 gap-800 border-b-100 border-system-light-secondary-background'>
                <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                        <div className='mr-400'>
                            {platform === mt5Platform
                                ? marketTypeDetails[marketType ?? MarketType.ALL].icon
                                : PlatformDetails[platform as keyof typeof PlatformDetails].icon}
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center gap-300'>
                                <Text size='md'>
                                    {platform === mt5Platform
                                        ? marketTypeDetails[marketType ?? MarketType.ALL].title
                                        : PlatformDetails[platform as keyof typeof PlatformDetails].title}{' '}
                                    {!activeAccount?.is_virtual && details?.landing_company_short?.toUpperCase()}
                                </Text>
                            </div>
                            <Text className='text-system-light-less-prominent-text' size='sm'>
                                {loginId}
                            </Text>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <Text bold>{details?.display_balance}</Text>
                    </div>
                </div>
                <div className='flex flex-col gap-100'>
                    {platform === mt5Platform && (
                        <Fragment>
                            <TradeDetailsItem label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                            <TradeDetailsItem
                                label='Server'
                                value={(details as THooks.MT5AccountsList)?.server_info?.environment ?? 'Deriv-Server'}
                            />
                            <TradeDetailsItem label='Login ID' value={loginId ?? '12345678'} />
                            <TradeDetailsItem label='Password' value='********' variant='password' />
                        </Fragment>
                    )}
                    {platform === dxtradePlatform && (
                        <Fragment>
                            <TradeDetailsItem
                                label='Username'
                                value={(details as THooks.DxtradeAccountsList)?.login ?? '12345678'}
                            />
                            <TradeDetailsItem label='Password' value='********' variant='password' />
                        </Fragment>
                    )}
                    {platform === ctraderPlatform && (
                        <TradeDetailsItem
                            value=' Use your Deriv account email and password to login into the cTrader platform.'
                            variant='info'
                        />
                    )}
                </div>
                <div className='flex gap-400'>
                    <div className='w-800 h-800'>
                        <ImportantIcon />
                    </div>
                    <Text size='sm'>{serviceMaintenanceMessages[(platform || mt5Platform) as TPlatforms.All]}</Text>
                </div>
            </div>
            <div className='w-full'>
                {platform === mt5Platform && (
                    <Fragment>
                        <TradeLink
                            app='web'
                            platform={mt5Platform}
                            webtraderUrl={(details as THooks.MT5AccountsList)?.webtrader_url}
                        />
                        {!isMobile && (
                            <Fragment>
                                <TradeLink app='windows' platform={mt5Platform} />
                                <TradeLink app='macos' platform={mt5Platform} />
                                <TradeLink app='linux' platform={mt5Platform} />
                            </Fragment>
                        )}
                    </Fragment>
                )}
                {platform === dxtradePlatform && (
                    <TradeLink isDemo={activeAccount?.is_virtual} platform={dxtradePlatform} />
                )}
                {platform === ctraderPlatform && (
                    <Fragment>
                        <TradeLink platform={ctraderPlatform} />
                        <TradeLink
                            app={ctraderPlatform as keyof typeof AppToContentMapper}
                            platform={ctraderPlatform}
                        />
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default TradeScreen;
