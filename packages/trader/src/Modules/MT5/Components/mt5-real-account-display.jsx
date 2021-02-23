import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Carousel } from '@deriv/components';
import { getAccountTypeFields, getMT5AccountListKey, getMT5AccountKey } from '@deriv/shared';
import {
    eu_real_financial_specs,
    real_financial_stp_specs,
    real_financial_specs,
    real_synthetic_specs,
} from 'Modules/MT5/Constants/mt5-specifications';
import { MT5AccountCard } from './mt5-account-card.jsx';

const getRealFinancialStpBtnLbl = (is_fully_authenticated, is_pending_authentication, has_required_credentials) => {
    if (is_fully_authenticated && has_required_credentials) {
        return <Localize i18n_default_text='Set your password' />;
    } else if (is_pending_authentication) {
        return <Localize i18n_default_text='Pending verification' />;
    }

    return <Localize i18n_default_text='Add real account' />;
};

const MT5RealAccountDisplay = ({
    has_real_account,
    is_accounts_switcher_on,
    is_eu,
    is_eu_country,
    has_malta_account,
    has_maltainvest_account,
    has_mt5_account_error,
    is_fully_authenticated,
    is_pending_authentication,
    is_virtual,
    landing_companies,
    onSelectAccount,
    openAccountTransfer,
    openPasswordModal,
    isAccountOfTypeDisabled,
    current_list,
    has_mt5_account,
    openPasswordManager,
    account_settings,
    openAccountNeededModal,
    standpoint,
    is_logged_in,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
    trading_servers,
    can_have_more_real_synthetic_mt5,
}) => {
    const should_show_trade_servers =
        (is_logged_in ? !is_eu && has_real_account : !is_eu_country) && can_have_more_real_synthetic_mt5;
    const [active_hover, setActiveHover] = React.useState(0);

    const has_required_credentials =
        account_settings.citizen && account_settings.tax_identification_number && account_settings.tax_residence;

    const button_label = getRealFinancialStpBtnLbl(
        is_fully_authenticated,
        is_pending_authentication,
        has_required_credentials
    );

    const is_real_financial_stp_disabled = !has_real_account || is_pending_authentication;

    const onSelectRealSynthetic = () => {
        if (is_eu && standpoint.malta && !has_malta_account) {
            openAccountNeededModal('malta', localize('Deriv Synthetic'), localize('DMT5 Synthetic'));
        } else {
            onSelectAccount({ type: 'synthetic', category: 'real' });
        }
    };
    const onSelectRealFinancial = () => {
        if (is_eu && !has_maltainvest_account) {
            openAccountNeededModal('maltainvest', localize('Deriv Financial'), localize('DMT5 Real Financial'));
        } else {
            onSelectAccount({ type: 'financial', category: 'real' });
        }
    };
    const onSelectRealFinancialStp = () => {
        const account_type = {
            category: 'real',
            type: 'financial_stp',
        };
        if (is_fully_authenticated && has_required_credentials) {
            openPasswordModal(account_type);
        } else if ((!is_fully_authenticated && !is_real_financial_stp_disabled) || !has_required_credentials) {
            onSelectAccount(account_type);
        }
    };

    const onClickFundReal = account =>
        openAccountTransfer(current_list[getMT5AccountListKey(account)], {
            category: account.account_type,
            type: getMT5AccountKey(account.market_type, account.sub_account_type),
        });

    const handleHoverCard = name => {
        const real_synthetic_accounts_list = Object.keys(current_list).filter(key => key.startsWith('real.synthetic'));
        setActiveHover(real_synthetic_accounts_list.findIndex(t => current_list[t].group === name));
    };

    const isMT5AccountCardDisabled = sub_account_type => {
        if (has_mt5_account_error) return true;

        if (is_eu) {
            const account = getAccountTypeFields({ category: 'real', type: sub_account_type });
            return isAccountOfTypeDisabled(account?.account_type);
        }

        switch (sub_account_type) {
            case 'synthetic':
            case 'financial':
                return !has_real_account;
            case 'financial_stp':
                return is_real_financial_stp_disabled;
            default:
                return false;
        }
    };

    const should_show_eu = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
    const synthetic_account_items =
        (landing_companies?.mt_gaming_company?.financial || !is_logged_in) &&
        (Object.keys(current_list).some(key => key.startsWith('real.synthetic'))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith('real.synthetic'))
                  .reduce((acc, cur) => {
                      acc.push(current_list[cur]);
                      return acc;
                  }, [])
                  .map((acc, index) => {
                      return (
                          <MT5AccountCard
                              key={index}
                              has_mt5_account={has_mt5_account}
                              has_mt5_account_error={has_mt5_account_error}
                              title={localize('Synthetic')}
                              is_hovered={index === active_hover}
                              is_disabled={isMT5AccountCardDisabled('synthetic')}
                              type={{
                                  category: 'real',
                                  type: 'synthetic',
                              }}
                              is_logged_in={is_logged_in}
                              should_show_trade_servers={should_show_trade_servers}
                              is_trade_server_button_visible={should_show_trade_servers}
                              existing_data={acc}
                              commission_message={localize('No commission')}
                              onSelectAccount={onSelectRealSynthetic}
                              onPasswordManager={openPasswordManager}
                              onClickFund={onClickFundReal}
                              descriptor={localize(
                                  'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                              )}
                              specs={real_synthetic_specs}
                              trading_servers={trading_servers}
                              onHover={handleHoverCard}
                          />
                      );
                  })
            : [
                  <MT5AccountCard
                      key='real.synthetic'
                      has_mt5_account={has_mt5_account}
                      title={localize('Synthetic')}
                      is_disabled={isMT5AccountCardDisabled('synthetic')}
                      type={{
                          category: 'real',
                          type: 'synthetic',
                      }}
                      is_logged_in={is_logged_in}
                      should_show_trade_servers={should_show_trade_servers}
                      is_trade_server_button_visible={should_show_trade_servers}
                      existing_data={undefined}
                      commission_message={localize('No commission')}
                      onSelectAccount={onSelectRealSynthetic}
                      onPasswordManager={openPasswordManager}
                      onClickFund={onClickFundReal}
                      descriptor={localize(
                          'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                      )}
                      specs={real_synthetic_specs}
                      trading_servers={trading_servers}
                      onHover={handleHoverCard}
                  />,
              ]);

    const financial_stp_account = (landing_companies?.mt_financial_company?.financial_stp || !is_logged_in) && (
        <MT5AccountCard
            key='real.financial_stp'
            has_mt5_account={has_mt5_account}
            title={localize('Financial STP')}
            type={{
                category: 'real',
                type: 'financial_stp',
            }}
            is_logged_in={is_logged_in}
            existing_data={current_list[Object.keys(current_list).find(key => key.startsWith('real.financial_stp@'))]}
            commission_message={localize('No commission')}
            onSelectAccount={onSelectRealFinancialStp}
            button_label={button_label}
            is_button_primary={is_pending_authentication}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            descriptor={localize(
                'Trade major, minor, exotic currency pairs, and cryptocurrencies with Straight-Through Processing (STP) of your orders direct to the market.'
            )}
            specs={real_financial_stp_specs}
            is_disabled={isMT5AccountCardDisabled('financial_stp')}
            is_virtual={is_virtual}
            has_real_account={has_real_account}
            toggleAccountsDialog={toggleAccountsDialog}
            toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            is_accounts_switcher_on={is_accounts_switcher_on}
            is_trade_server_button_visible={should_show_trade_servers}
        />
    );

    const financial_account = (landing_companies?.mt_financial_company?.financial || !is_logged_in) && (
        <MT5AccountCard
            key='real.financial'
            has_mt5_account={has_mt5_account}
            is_disabled={isMT5AccountCardDisabled('financial')}
            title={localize('Financial')}
            type={{
                category: 'real',
                type: 'financial',
            }}
            existing_data={current_list[Object.keys(current_list).find(key => key.startsWith('real.financial@'))]}
            commission_message={localize('No commission')}
            onSelectAccount={onSelectRealFinancial}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            descriptor={
                is_eu || is_eu_country
                    ? localize(
                          'Trade commodities, cryptocurrencies, major (standard) and minor currency pairs with high leverage.'
                      )
                    : localize(
                          'Trade commodities, cryptocurrencies, major (standard and micro-lots) and minor currency pairs with high leverage.'
                      )
            }
            specs={should_show_eu ? eu_real_financial_specs : real_financial_specs}
            is_logged_in={is_logged_in}
            is_trade_server_button_visible={should_show_trade_servers}
        />
    );

    const items = [...(synthetic_account_items || []), financial_account, financial_stp_account].filter(Boolean);

    return (
        <div className='mt5-real-accounts-display'>
            <DesktopWrapper>
                <Carousel
                    list={items}
                    width={328}
                    nav_position='middle'
                    show_bullet={false}
                    item_per_window={3}
                    className='mt5-real-accounts-display__carousel'
                />
            </DesktopWrapper>
            <MobileWrapper>
                {items.map(item => {
                    return item;
                })}
            </MobileWrapper>
        </div>
    );
};

export { MT5RealAccountDisplay };
