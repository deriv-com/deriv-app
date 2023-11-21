import React from 'react';
import { when } from 'mobx';
import { MobileWrapper } from '@deriv/components';
import { isMobile, WS } from '@deriv/shared';
import PopulateHeader from './populate-header';
import { observer, useStore } from '@deriv/stores';
import TraderProviders from '../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';

type TradeHeaderExtensionsProps = {
    store: TCoreStores;
};

const TradeHeaderExtensions = observer(({ store }: TradeHeaderExtensionsProps) => {
    const { client, modules, ui, portfolio } = useStore();
    const { populateHeaderExtensions } = ui;
    const { onMount: onMountPositions } = portfolio;
    const { is_logged_in, is_populating_account_list } = client;
    const { onMountCommon: onMountCashier, setAccountSwitchListener } = modules.cashier.general_store;

    const show_component = is_logged_in;

    const populateHeaderfunction = React.useCallback(() => {
        const header_items = show_component ? (
            <MobileWrapper>
                <TraderProviders store={store}>
                    <PopulateHeader />
                </TraderProviders>
            </MobileWrapper>
        ) : null;

        populateHeaderExtensions(header_items);
    }, [populateHeaderExtensions, store, is_populating_account_list]);

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (isMobile()) {
                await when(() => !is_populating_account_list); // Waits for login to complete
                if (is_logged_in) {
                    await WS.wait('authorize');
                    onMountPositions();
                    onMountCashier(true);
                    setAccountSwitchListener();
                }
            }

            populateHeaderfunction();
        };

        waitForLogin().catch(() => {
            // Do nothing: This is to remove the bug reported by SonarCloud about not having a catch statement here.
        });

        return () => populateHeaderExtensions(null);
    }, [
        onMountCashier,
        onMountPositions,
        populateHeaderfunction,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
    ]);

    React.useEffect(() => {
        populateHeaderfunction();
    });

    return null;
});

export default TradeHeaderExtensions;
