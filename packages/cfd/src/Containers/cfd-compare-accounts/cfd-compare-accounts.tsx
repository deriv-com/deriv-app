import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Text, Icon, PageOverlay, DesktopWrapper, MobileWrapper, CFDCompareAccountsCarousel } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import CFDCompareAccountsCard from './cfd-compare-accounts-card';
import { getSortedAvailableAccounts } from '../../Helpers/compare-accounts-config';

import { useStore } from '@deriv/stores';

const CompareCFDs = observer(() => {
    const { client } = useStore();
    const { trading_platform_available_accounts } = client;

    const history = useHistory();
    const sorted_available_accounts = getSortedAvailableAccounts(trading_platform_available_accounts);

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
                <PageOverlay header={DesktopHeader} is_from_app={routes.traders_hub} />
                <div className='compare-cfd-account-container'>
                    <div className='card-list'>
                        <CFDCompareAccountsCarousel>
                            {sorted_available_accounts.map(item => (
                                <React.Fragment key={item.market_type + item.shortcode}>
                                    <CFDCompareAccountsCard
                                        trading_platforms={item}
                                        key={item.market_type + item.shortcode}
                                    />
                                </React.Fragment>
                            ))}
                        </CFDCompareAccountsCarousel>
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
                    mobile wrapper
                </PageOverlay>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default CompareCFDs;
