import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS, routes, getCFDAccountKey, getAccountListKey } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import AccountManager from '../account-manager';
import AddDerived from 'Components/add-derived';
import { TCFDAccountsProps, TPlatform, TDetailsOfEachMT5Loginid, TStaticAccountProps, TRootStore } from 'Types';
import AddOptionsAccount from 'Components/add-options-account';
import { useStores } from 'Stores/index';
import { useHistory } from 'react-router-dom';

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

const CFDRealAccounts = ({
    isDerivedVisible,
    isFinancialVisible,
    has_cfd_account_error,
    current_list,
    has_real_account,
}: TCFDAccountsProps) => {
    const { client, modules, common }: TRootStore = useStores();
    const {
        dxtrade_tokens,
        setAccountType,
        createCFDAccount,
        enableCFDPasswordModal,
        toggleJurisdictionModal,
        disableCFDPasswordModal,
        toggleMT5TradeModal,
        setMT5TradeAccount,
    } = modules.cfd;
    const { setAppstorePlatform, platform } = common;
    const { isEligibleForMoreRealMt5, is_eu } = client;
    const history = useHistory();
    const account_name = is_eu ? 'CFDs' : 'Financial';
    const account_desc = is_eu
        ? 'Trade CFDs on forex, stocks, stock indices, synthetic indices, cryptocurrencies, and commodities with leverage.'
        : 'Trade CFDs on Deriv MT5 with forex, stocks & indices, commodities, and cryptocurrencies.';
    const available_real_accounts: TStaticAccountProps[] = [
        {
            name: 'Derived',
            description: localize(
                'Trade CFDs on Deriv MT5 with Derived indices that simulate real-world market movements.'
            ),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'synthetic',
        },
        {
            name: account_name,
            description: localize(account_desc),
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'financial',
        },
        {
            name: 'Deriv X',
            description: localize(
                'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
            ),
            is_visible: isDerivedVisible(CFD_PLATFORMS.DXTRADE),
            disabled: has_cfd_account_error(CFD_PLATFORMS.DXTRADE),
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'synthetic',
            // ToDo: deriv x should have type of all in new API
            // type: 'all'
        },
    ];
    const REAL_DXTRADE_URL = 'https://dx.deriv.com';
    const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

    const getDXTradeWebTerminalLink = (category: string, token?: string) => {
        let url = category === 'real' ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

        if (token) {
            url += `?token=${token}`;
        }

        return url;
    };

    const openAccountTransfer = (
        data: DetailsOfEachMT5Loginid & { account_id?: string; platform?: string },
        meta: { category: string; type?: string }
    ) => {
        if (data.platform === CFD_PLATFORMS.DXTRADE)
            sessionStorage.setItem('cfd_transfer_to_login_id', data.account_id as string);
        else sessionStorage.setItem('cfd_transfer_to_login_id', data.login as string);

        disableCFDPasswordModal();
        history.push(routes.cashier_acc_transfer);
    };

    const onClickFundReal = (account: DetailsOfEachMT5Loginid) => {
        if (platform === 'dxtrade') {
            return openAccountTransfer(current_list[getAccountListKey(account, platform)], {
                category: account.account_type as keyof TOpenAccountTransferMeta,
                type: getCFDAccountKey({
                    market_type: account.market_type,
                    sub_account_type: account.sub_account_type,
                    platform,
                }),
            });
        }
        return openAccountTransfer(account, {
            category: account.account_type as keyof TOpenAccountTransferMeta,
            type: getCFDAccountKey({
                market_type: account.market_type,
                sub_account_type: account.sub_account_type,
                platform: CFD_PLATFORMS.MT5,
            }),
        });
    };

    const OnClickGetAccount = (account: TStaticAccountProps) => {
        if (has_real_account && account.platform === CFD_PLATFORMS.MT5) {
            toggleJurisdictionModal();
            setAccountType({
                category: 'real',
                type: account.type,
            });
            setAppstorePlatform(account.platform);
        } else {
            setAccountType({
                category: 'real',
                type: account.type,
            });
            setAppstorePlatform(account.platform);
            createCFDAccount({
                category: 'real',
                type: account.type,
            });
            enableCFDPasswordModal();
        }
    };

    const existingRealAccounts = (existing_platform: TPlatform, market_type?: string) => {
        const acc = Object.keys(current_list).some(key => {
            if (existing_platform === CFD_PLATFORMS.MT5) {
                return key.startsWith(`${existing_platform}.real.${market_type}`);
            }
            return key.startsWith(`${existing_platform}.real.${market_type}@${market_type}`);
        })
            ? Object.keys(current_list)
                  .filter(key => {
                      if (existing_platform === CFD_PLATFORMS.MT5) {
                          return key.startsWith(`${existing_platform}.real.${market_type}`);
                      }
                      return key.startsWith(`${existing_platform}.real.${market_type}@${market_type}`);
                  })
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as TDetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    const numberOfExistingAccounts = (account: TStaticAccountProps, market_type: 'financial' | 'synthetic') => {
        return existingRealAccounts(account.platform, account?.type)?.filter(acc => acc.market_type === market_type)
            .length;
    };

    return (
        <div className='cfd-real-account'>
            {!has_real_account && <AddOptionsAccount />}
            <div className='cfd-real-account__accounts'>
                {available_real_accounts.map(
                    account =>
                        account.is_visible && (
                            <div className={`cfd-real-account__accounts--item ${account.name}`} key={account.name}>
                                {existingRealAccounts(account.platform, account?.type) ? (
                                    existingRealAccounts(account.platform, account?.type)?.map(
                                        (existing_account, index) => {
                                            const number_of_financial_accounts = numberOfExistingAccounts(
                                                account,
                                                'financial'
                                            );

                                            const number_of_derived_accounts = numberOfExistingAccounts(
                                                account,
                                                'synthetic'
                                            );
                                            const non_eu_accounts =
                                                existing_account.landing_company_short &&
                                                existing_account.landing_company_short !== 'svg' &&
                                                existing_account.landing_company_short !== 'bvi'
                                                    ? existing_account.landing_company_short?.charAt(0).toUpperCase() +
                                                      existing_account.landing_company_short?.slice(1)
                                                    : existing_account.landing_company_short?.toUpperCase();

                                            const title_shortcode =
                                                is_eu || account.platform === CFD_PLATFORMS.DXTRADE
                                                    ? ''
                                                    : non_eu_accounts;
                                            return (
                                                <div className='existing-accounts' key={existing_account.name}>
                                                    <AccountManager
                                                        has_account={true}
                                                        type={existing_account.market_type}
                                                        appname={`${account.name} ${title_shortcode}`}
                                                        platform={account.platform}
                                                        disabled={false}
                                                        loginid={existing_account?.display_login}
                                                        currency={existing_account.currency}
                                                        amount={existing_account.display_balance}
                                                        onClickTopUp={() => onClickFundReal(existing_account)}
                                                        onClickTrade={() => {
                                                            toggleMT5TradeModal();
                                                            setMT5TradeAccount(existing_account);
                                                        }}
                                                        dxtrade_link={getDXTradeWebTerminalLink(
                                                            'real',
                                                            dxtrade_tokens.real
                                                        )}
                                                        description={account.description}
                                                    />
                                                    {isEligibleForMoreRealMt5(existing_account.market_type) &&
                                                        (number_of_financial_accounts === index + 1 ||
                                                            number_of_derived_accounts === index + 1) &&
                                                        account.platform !== CFD_PLATFORMS.DXTRADE && (
                                                            <AddDerived
                                                                title={localize(`More ${account.name} accounts`)}
                                                                onClickHandler={() => {
                                                                    toggleJurisdictionModal();
                                                                    setAccountType({
                                                                        category: 'real',
                                                                        type: account.type,
                                                                    });
                                                                    setAppstorePlatform(account.platform);
                                                                }}
                                                                class_names='cfd-real-account__accounts--item__add-derived'
                                                            />
                                                        )}
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <div className='available-accounts' key={account.name}>
                                        <AccountManager
                                            has_account={false}
                                            type={account.type || ''}
                                            appname={account.name}
                                            platform={account.platform}
                                            disabled={!has_real_account}
                                            onClickGet={() => {
                                                OnClickGetAccount(account);
                                            }}
                                            description={account.description}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

export default observer(CFDRealAccounts);
