import React from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Icon, PageOverlay, DesktopWrapper, MobileWrapper, CFDCompareAccountsCarousel } from '@deriv/components';
import { routes, CFD_PLATFORMS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import CFDCompareAccountsCard from './cfd-compare-accounts-card';
import {
    getSortedAvailableAccounts,
    getEUAvailableAccounts,
    getDxtradeAccountAvailabaility,
    prepareDxtradeData,
    getMT5DemoData,
} from '../../Helpers/compare-accounts-config';

const CompareCFDs = observer(() => {
    const history = useHistory();
    const store = useStore();
    const { client, traders_hub } = store;
    const { trading_platform_available_accounts } = client;
    const { available_cfd_accounts, is_demo, is_eu_user } = traders_hub;

    const sorted_available_accounts = !is_eu_user
        ? getSortedAvailableAccounts(trading_platform_available_accounts)
        : getEUAvailableAccounts(trading_platform_available_accounts);

    const has_dxtrade_account_available = getDxtradeAccountAvailabaility(available_cfd_accounts);

    const dxtrade_data = available_cfd_accounts.filter(accounts => accounts.platform === CFD_PLATFORMS.DXTRADE);
    const { name, market_type } = dxtrade_data[0];
    const dxtrade_account = prepareDxtradeData(name, market_type);

    const sorted_available_eu_accounts =
        is_eu_user && sorted_available_accounts.length ? [...sorted_available_accounts] : [];
    const all_real_sorted_available_accounts =
        has_dxtrade_account_available && !is_eu_user
            ? [...sorted_available_accounts, dxtrade_account]
            : [...sorted_available_eu_accounts];

    const demo_available_accounts = getMT5DemoData(all_real_sorted_available_accounts);
    const all_available_accounts =
        is_demo && demo_available_accounts.length > 0 ? demo_available_accounts : all_real_sorted_available_accounts;

    const DesktopHeader = (
        <div className='compare-cfd-header'>
            <div
                className='compare-cfd-header-navigation'
                onClick={() => {
                    history.push(routes.traders_hub);
                }}
            >
                <Icon icon='IcArrowLeftBold' />
                <Text size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text="Trader's hub" />
                </Text>
            </div>
            <h1 className='compare-cfd-header-title'>
                <Text size='m' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Compare CFDs accounts' />
                </Text>
            </h1>
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='compare-cfd-account'>
                    <PageOverlay header={DesktopHeader} is_from_app={routes.traders_hub} />
                    <div className='compare-cfd-account-container'>
                        <div className='card-list'>
                            <CFDCompareAccountsCarousel>
                                {all_available_accounts.map(item => (
                                    <CFDCompareAccountsCard
                                        trading_platforms={item}
                                        key={item.market_type + item.shortcode}
                                    />
                                ))}
                            </CFDCompareAccountsCarousel>
                        </div>
                    </div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    header={localize('Compare CFDs accounts')}
                    header_classname='compare-cfd-header-title'
                    is_from_app={!routes.traders_hub}
                    onClickClose={() => history.push(routes.traders_hub)}
                >
                    <div className='compare-cfd-account-container'>
                        <CFDCompareAccountsCarousel>
                            {all_available_accounts.map(item => (
                                <CFDCompareAccountsCard
                                    trading_platforms={item}
                                    key={item.market_type + item.shortcode}
                                />
                            ))}
                        </CFDCompareAccountsCarousel>
                    </div>
                </PageOverlay>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default CompareCFDs;
