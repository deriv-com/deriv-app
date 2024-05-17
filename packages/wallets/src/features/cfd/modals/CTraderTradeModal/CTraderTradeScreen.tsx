import React, { useEffect } from 'react';
import {
    useActiveWalletAccount,
    useAvailableCTraderAccounts,
    useCreateOtherCFDAccount,
    useCtraderAccountsList,
} from '@deriv/api-v2';
import { LabelPairedCircleExclamationMdFillIcon } from '@deriv/quill-icons';
import { Accordion } from '@deriv-com/ui';
import { WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { CFD_PLATFORMS, MARKET_TYPE, PlatformDetails, serviceMaintenanceMessages } from '../../constants';
import { MT5TradeLink } from '../../screens/MT5TradeScreen/MT5TradeLink';
import { CTraderAddAccountSuccessModal } from '../CTraderAddAccountSuccessModal';

const CTraderTradeScreen = () => {
    const { isDesktop } = useDevice();
    const { getModalState, show } = useModal();
    const ctraderPlatform = CFD_PLATFORMS.CTRADER;
    const platform = getModalState('platform') ?? ctraderPlatform;
    const { icon: platformIcon, title: platformTitle } = PlatformDetails[platform];

    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: availableCtraderAccounts } = useAvailableCTraderAccounts();
    const availableAccount = availableCtraderAccounts?.[0];

    const { data: activeWalletData } = useActiveWalletAccount();
    const {
        error: createAccountError,
        isSuccess: isAccountCreated,
        mutate: createAccount,
    } = useCreateOtherCFDAccount();
    const { is_virtual: isDemo = false } = activeWalletData ?? {};

    const onClickGetMoreButton = () => {
        createAccount({
            payload: {
                account_type: isDemo ? 'demo' : 'real',
                market_type: MARKET_TYPE.ALL,
                platform: CFD_PLATFORMS.CTRADER,
            },
        });
    };

    const totalBalance = ctraderAccountsList?.reduce((acc, cur) => acc + +(cur?.display_balance || 0), 0);

    useEffect(() => {
        // if (isAccountCreated) {

        // }
        show(<CTraderAddAccountSuccessModal />);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAccountCreated]);

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
                        <button onClick={onClickGetMoreButton} type='button'>
                            Get another cTrader account
                        </button>
                    )}

                <Accordion title='See important notes'>
                    <ol>
                        <li>Use your Deriv account email and password to log in to cTrader.</li>
                        <li>
                            Manage up to 5 Deriv cTrader accounts. While you can convert any of your Deriv cTrader
                            accounts into a strategy account, please take note of the following:
                            <ul>
                                <li>When setting up a strategy, you have the option to impose fees.</li>
                                <li>
                                    For strategies where you impose fees, you must assign one of your existing accounts
                                    to process these fees. The same ‘Account For Fees’ can support multiple fee-based
                                    strategies.
                                </li>
                                <li>Free strategies do not require an ‘Account For Fees’.</li>
                                <li>
                                    An account designated as a strategy provider is irreversible unless it remains
                                    inactive for 30 days.
                                </li>
                                <li>
                                    An account cannot simultaneously be a strategy provider and serve as an ‘Account For
                                    Fees’.
                                </li>
                                <li>
                                    To ensure you can always create and manage strategies with fees,{' '}
                                    <strong>keep at least one account free from being a strategy provider</strong>. This
                                    way, you’ll always have an account ready for collecting fees, allowing you to have
                                    up to four strategies where you may impose fees.
                                </li>
                            </ul>
                        </li>
                    </ol>
                </Accordion>

                <div className='wallets-mt5-trade-screen__details-maintenance'>
                    <LabelPairedCircleExclamationMdFillIcon fill='#FFAD3A' />
                    <WalletText color='less-prominent' size={isDesktop ? '2xs' : 'xs'}>
                        {serviceMaintenanceMessages[platform]}
                    </WalletText>
                </div>
            </div>
            <div className='wallets-mt5-trade-screen__links'>
                <MT5TradeLink platform={ctraderPlatform} />
                <MT5TradeLink app={ctraderPlatform} platform={ctraderPlatform} />
            </div>
        </div>
    );
};

export default CTraderTradeScreen;
