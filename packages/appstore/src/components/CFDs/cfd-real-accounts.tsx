import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDAccountManager from '../cfd-account-manager';
import AddDerived from 'Components/add-derived';
import { TCFDAccountsProps, TPlatform, TDetailsOfEachMT5Loginid } from 'Types';
import MissingRealAccount from 'Components/missing-real-acount';

const CFDRealAccounts = ({
    isDerivedVisible,
    isFinancialVisible,
    isDerivXVisible,
    has_cfd_account_error,
    current_list,
    has_real_account,
}: TCFDAccountsProps) => {
    const available_real_accounts = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'derived',
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
            is_visible: isDerivXVisible(CFD_PLATFORMS.DXTRADE),
            disabled: has_cfd_account_error(CFD_PLATFORMS.DXTRADE),
            platform: CFD_PLATFORMS.DXTRADE,
        },
    ];

    const existing_real_accounts = (platform: TPlatform, market_type?: string) => {
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
            {!has_real_account && <MissingRealAccount onClickSignup={() => null} />}
            <div className='cfd-real-account__accounts'>
                {available_real_accounts.map(account => (
                    <div className={`cfd-real-account__accounts-${account.name}`} key={account.name}>
                        {existing_real_accounts(account.platform, account.type)
                            ? existing_real_accounts(account.platform, account.type)?.map(existing_account => (
                                  <div
                                      className={`cfd-demo-account__accounts-${account.name}--item`}
                                      key={existing_account.login}
                                  >
                                      <CFDAccountManager
                                          has_account={true}
                                          type={account.type || ''}
                                          appname={account.name}
                                          platform={account.platform}
                                          disabled={false}
                                          loginid={existing_account.display_login}
                                          currency={existing_account.country}
                                          amount={existing_account.display_balance}
                                          onClickTopUp={() => null}
                                          onClickTrade={() => null}
                                          description={account.description}
                                      />
                                      {account.type === 'derived' && (
                                          <AddDerived
                                              title={localize('More Derived accounts')}
                                              onClickHandler={() => null}
                                              class_names='cfd-real-account__accounts--item__add-derived'
                                          />
                                      )}
                                  </div>
                              ))
                            : account.is_visible && (
                                  <div className='cfd-demo-account__accounts--item' key={account.name}>
                                      <CFDAccountManager
                                          has_account={false}
                                          type={account.type || ''}
                                          appname={account.name}
                                          platform={account.platform}
                                          disabled={account.disabled}
                                          onClickGet={() => null}
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
