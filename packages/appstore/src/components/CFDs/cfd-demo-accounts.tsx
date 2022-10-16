import React from 'react';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import AccountManager from '../account-manager';
import { TCFDAccountsProps, TPlatform, TDetailsOfEachMT5Loginid, TStaticAccountProps, TRootStore } from 'Types';
import { useStores } from 'Stores/index';

const CFDDemoAccounts = ({ isDerivedVisible, isFinancialVisible, current_list }: TCFDAccountsProps) => {
    const available_demo_accounts: Array<TStaticAccountProps> = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'synthetic',
        },
        {
            name: 'Financial',
            description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'financial',
        },
        {
            name: 'Deriv X',
            is_visible: isDerivedVisible(CFD_PLATFORMS.DXTRADE),
            description: localize(
                'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
            ),
            disabled: false,
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'synthetic',
            // ToDo: deriv x should have type of all in new API
            // type: 'all'
        },
    ];

    const { client, modules, common }: TRootStore = useStores();
    const {
        standpoint,
        createCFDAccount,
        setMT5TradeAccount,
        openAccountTransfer,
        toggleMT5TradeModal,
        enableCFDPasswordModal,
        openAccountNeededModal,
        has_maltainvest_account,
    } = modules.cfd;
    const { platform, setAppstorePlatform } = common;
    const { is_eu } = client;

    const openCFDAccount = (account_type: string) => {
        if (is_eu && !has_maltainvest_account && standpoint.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
        } else {
            createCFDAccount({
                category: 'demo',
                type: account_type,
                platform,
            });
            enableCFDPasswordModal();
        }
    };

    const existingDemoAccounts = (existing_platform: TPlatform, market_type?: string) => {
        const acc = Object.keys(current_list).some(key => key.startsWith(`${existing_platform}.demo.${market_type}`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${existing_platform}.demo.${market_type}`))
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
                {available_demo_accounts.map(account => (
                    <div className={`cfd-demo-account__accounts-${account.name}`} key={account.name}>
                        {existingDemoAccounts(account.platform, account.type)
                            ? existingDemoAccounts(account.platform, account.type)?.map(existing_account => {
                                  const non_eu_accounts =
                                      existing_account.landing_company_short &&
                                      existing_account.landing_company_short !== 'svg' &&
                                      existing_account.landing_company_short !== 'bvi'
                                          ? existing_account.landing_company_short?.charAt(0).toUpperCase() +
                                            existing_account.landing_company_short?.slice(1)
                                          : existing_account.landing_company_short?.toUpperCase();

                                  return (
                                      <div
                                          className={`cfd-demo-account__accounts-${account.name}--item`}
                                          key={existing_account.login}
                                      >
                                          <AccountManager
                                              has_account={true}
                                              type={existing_account.market_type}
                                              appname={`${account.name} ${non_eu_accounts}`}
                                              platform={account.platform}
                                              disabled={false}
                                              loginid={existing_account.display_login}
                                              currency={existing_account.currency}
                                              amount={existing_account.display_balance}
                                              onClickTopUp={() =>
                                                  openAccountTransfer(
                                                      current_list[
                                                          Object.keys(current_list).find((key: string) =>
                                                              key.startsWith(`${platform}.demo.${account.type}`)
                                                          ) || ''
                                                      ],
                                                      {
                                                          category: 'demo',
                                                          type: account.type,
                                                      }
                                                  )
                                              }
                                              onClickTrade={() => {
                                                  toggleMT5TradeModal();
                                                  setMT5TradeAccount(existing_account);
                                              }}
                                              description={account.description}
                                          />
                                      </div>
                                  );
                              })
                            : account.is_visible && (
                                  <div className='cfd-demo-account__accounts--item' key={account.name}>
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
                ))}
            </div>
        </div>
    );
};

export default CFDDemoAccounts;
