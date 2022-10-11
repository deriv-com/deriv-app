import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import AccountManager from '../account-manager';
import AddDerived from 'Components/add-derived';
import { TCFDAccountsProps, TPlatform, TDetailsOfEachMT5Loginid, TStaticAccountProps, TRootStore } from 'Types';
import AddOptionsAccount from 'Components/add-options-account';
import { useStores } from 'Stores/index';

const CFDRealAccounts = ({
    isDerivedVisible,
    isFinancialVisible,
    has_cfd_account_error,
    current_list,
    has_real_account,
}: TCFDAccountsProps) => {
    const { client, modules }: TRootStore = useStores();
    const { isEligibleForMoreRealMt5 } = client;
    const { toggleJurisdictionModal, is_jurisdiction_modal_visible } = modules.cfd;

    const available_real_accounts: Array<TStaticAccountProps> = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'synthetic',
        },
        {
            name: 'Financial',
            description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
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

    const existingRealAccounts = (platform: TPlatform, market_type?: string) => {
        const acc = Object.keys(current_list).some(key => key.startsWith(`${platform}.real.${market_type}`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.real.${market_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as TDetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    return (
        <div className='cfd-real-account'>
            {!has_real_account && <AddOptionsAccount />}
            <div className='cfd-real-account__accounts'>
                {available_real_accounts.map(account => (
                    <div className={`cfd-real-account__accounts-${account.name}`} key={account.name}>
                        {existingRealAccounts(account.platform, account?.type)
                            ? existingRealAccounts(account.platform, account?.type)?.map(existing_account => {
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
                                              loginid={existing_account?.display_login}
                                              currency={existing_account.currency}
                                              amount={existing_account.display_balance}
                                              //   TODO will pass the click functions when flows are updated
                                              onClickTopUp={() => null}
                                              onClickTrade={() => null}
                                              description={account.description}
                                          />
                                          {isEligibleForMoreRealMt5(existing_account.market_type) &&
                                              account.platform !== CFD_PLATFORMS.DXTRADE && (
                                                  <AddDerived
                                                      title={localize(`More ${account.name} accounts`)}
                                                      onClickHandler={() => null}
                                                      class_names='cfd-real-account__accounts--item__add-derived'
                                                  />
                                              )}
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
                                              toggleJurisdictionModal();
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

export default observer(CFDRealAccounts);
