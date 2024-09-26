import React from 'react';
import { render } from '@testing-library/react';
import TraderProviders from '../../../trader-providers';
import TradeHeaderExtensions from '../trade-header-extensions';
import { mockStore } from '@deriv/stores';
import ui from '@deriv-com/ui';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        wait: jest.fn(() => Promise.resolve('authorized')),
    },
    isMobile: jest.fn(() => true),
}));

describe('<TradeHeaderExtensions />', () => {
    let mock_store: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                client: {
                    is_logged_in: true,
                    is_populating_account_list: false,
                },
                portfolio: {
                    onMount: jest.fn(),
                },
                ui: {
                    populateHeaderExtensions: jest.fn(item => item),
                },
                modules: {
                    cashier: {
                        general_store: {
                            onMountCommon: jest.fn(),
                            setAccountSwitchListener: jest.fn(),
                        },
                    },
                },
            }),
        };
    });
    const renderTraderFooterExtensions = (mocked_store: ReturnType<typeof mockStore>) => {
        return render(
            <TraderProviders store={mocked_store}>
                <TradeHeaderExtensions store={mocked_store} />
            </TraderProviders>
        );
    };
    it('populateHeaderExtensions should not be called with null if show_component is true', async () => {
        const spy = jest.spyOn(ui, 'useDevice').mockImplementation(() => ({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
            isTabletPortrait: false,
            isMobileOrTabletLandscape: false,
        }));

        renderTraderFooterExtensions(mock_store);
        expect(mock_store.ui.populateHeaderExtensions).not.toHaveBeenCalledWith(null);

        spy.mockRestore();
    });
    it('populateHeaderExtensions should be called with null if is_logged_in is false', async () => {
        mock_store.client.is_logged_in = false;
        renderTraderFooterExtensions(mock_store);
        expect(mock_store.ui.populateHeaderExtensions).toHaveBeenCalledWith(null);
    });
});
