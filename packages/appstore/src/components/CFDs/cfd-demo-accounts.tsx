import React from 'react';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import AccountManager from '../account-manager';
import { TCFDAccountsProps, TPlatform, TDetailsOfEachMT5Loginid, TStaticAccountProps, TRootStore } from 'Types';
import { useStores } from 'Stores/index';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const CFDDemoAccounts = ({ isDerivedVisible, isFinancialVisible, current_list }: TCFDAccountsProps) => {
    const { client, modules, common, ui }: TRootStore = useStores();
    const { is_eu } = client;
    const account_name = is_eu ? localize('CFDs') : localize('Financial');
    const account_desc = is_eu
        ? localize(
              'Trade CFDs on MT5 with forex, stocks, stock indices, synthetics, cryptocurrencies, and commodities.'
          )
        : localize('Trade CFDs on MT5 with forex, stocks, stock indices, commodities, and cryptocurrencies.');

    const available_demo_accounts: TStaticAccountProps[] = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with synthetics, baskets, and derived FX.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'synthetic',
        },
        {
            name: account_name,
            description: account_desc,
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'financial',
        },
        {
            name: 'Deriv X',
            is_visible: isDerivedVisible(CFD_PLATFORMS.DXTRADE),
            description: localize('Trade CFDs on Deriv X with financial markets and our Derived indices.'),
            disabled: false,
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'all',
        },
    ];

    const {
        standpoint,
        dxtrade_tokens,
        createCFDAccount,
        setCurrentAccount,
        setMT5TradeAccount,
        toggleMT5TradeModal,
        enableCFDPasswordModal,
        openAccountNeededModal,
        has_maltainvest_account,
    } = modules.cfd;
    const { platform, setAppstorePlatform } = common;
    const { openTopUpModal } = ui;

    const openAccountTransfer = (
        data: DetailsOfEachMT5Loginid & { account_id?: string; platform?: string },
        meta: { category: string; type?: string }
    ) => {
        setCurrentAccount(data, meta);
        openTopUpModal();
    };

    const REAL_DXTRADE_URL = 'https://dx.deriv.com';
    const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

    const getDXTradeWebTerminalLink = (category: string, token?: string) => {
        let url = category === 'real' ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

        if (token) {
            url += `?token=${token}`;
        }

        return url;
    };

    const openCFDAccount = (account_type: string) => {
        if (is_eu && !has_maltainvest_account && standpoint?.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
            return;
        }
        createCFDAccount({
            category: 'demo',
            type: account_type,
            platform,
        });
        enableCFDPasswordModal();
    };

    const existingDemoAccounts = (existing_platform: TPlatform, market_type?: string) => {
        const acc = Object.keys(current_list).some(key => {
            if (existing_platform === CFD_PLATFORMS.MT5) {
                return key.startsWith(`${existing_platform}.demo.${market_type}`);
            }
            return key.startsWith(`${existing_platform}.demo.${existing_platform}@${market_type}`);
        })
            ? Object.keys(current_list)
                  .filter(key => {
                      if (existing_platform === CFD_PLATFORMS.MT5) {
                          return key.startsWith(`${existing_platform}.demo.${market_type}`);
                      }
                      return key.startsWith(`${existing_platform}.demo.${existing_platform}@${market_type}`);
                  })
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as TDetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    return (
        <div className='cfd-demo-account'>
            <div className='cfd-demo-account__accounts'>
                {available_demo_accounts.map(account => {
                    const existing_demo_accounts = existingDemoAccounts(account.platform, account.type);
                    return (
                        account.is_visible && (
                            <div className={`cfd-demo-account__accounts--item ${account.name}`} key={account.name}>
                                {existing_demo_accounts ? (
                                    existing_demo_accounts.map(existing_account => {
                                        return (
                                            <div className='existing-accounts' key={existing_account.name}>
                                                <AccountManager
                                                    has_account={true}
                                                    type={existing_account.market_type}
                                                    appname={`${account.name} Demo`}
                                                    platform={account.platform}
                                                    disabled={false}
                                                    loginid={existing_account.display_login}
                                                    currency={existing_account.currency}
                                                    amount={existing_account.display_balance}
                                                    dxtrade_link={getDXTradeWebTerminalLink(
                                                        'demo',
                                                        dxtrade_tokens.demo
                                                    )}
                                                    onClickTopUp={() => {
                                                        openAccountTransfer(
                                                            current_list[
                                                                Object.keys(current_list).find((key: string) => {
                                                                    if (account.platform === 'mt5') {
                                                                        return key.startsWith(
                                                                            `${account.platform}.demo.${account.type}`
                                                                        );
                                                                    }
                                                                    return key.startsWith(
                                                                        `${account.platform}.demo.${account.platform}@${account.type}`
                                                                    );
                                                                }) || ''
                                                            ],
                                                            {
                                                                category: 'demo',
                                                                type: account.type,
                                                            }
                                                        );
                                                    }}
                                                    onClickTrade={() => {
                                                        toggleMT5TradeModal();
                                                        setMT5TradeAccount(existing_account);
                                                    }}
                                                    description={account.description}
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className='available-accounts' key={account.name}>
                                        <AccountManager
                                            has_account={false}
                                            type={account.type || ''}
                                            appname={account.name}
                                            platform={account.platform}
                                            disabled={account.disabled}
                                            onClickGet={() => {
                                                setAppstorePlatform(account.platform);
                                                openCFDAccount(account.type);
                                            }}
                                            description={account.description}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
};

export default CFDDemoAccounts;
