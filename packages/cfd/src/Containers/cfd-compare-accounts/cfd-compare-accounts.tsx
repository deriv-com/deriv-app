import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Text, Icon, PageOverlay, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';

import { useStore } from '@deriv/stores';

const CompareCFDs = observer(() => {
    const { client } = useStore();
    const { trading_platform_available_accounts } = client;

    const history = useHistory();

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
                    <Localize i18n_default_text='Compare all available accounts' />
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
                        {trading_platform_available_accounts.map(item => (
                            <CFDInstrumentsLabelHighlighted
                                key={item.market_type + item.shortcode}
                                trading_platforms={item}
                            />
                        ))}
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
