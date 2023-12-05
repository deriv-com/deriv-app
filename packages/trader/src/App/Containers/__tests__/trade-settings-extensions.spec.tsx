import React from 'react';
import { render } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import Loadable from 'react-loadable';
import TradeSettingsExtensions from '../trade-settings-extensions';
import TraderProviders from '../../../trader-providers';

Loadable.preloadAll();

describe('<TradeSettingsExtensions/>', () => {
    const default_mock_store = {
        ...mockStore({}),
        ui: {
            ...mockStore({}).ui,
            populateSettingsExtensions: jest.fn(menu_items => menu_items[0].value(mockStore({}))),
        },
    };

    const mockTradeSettingsExtensions = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <TradeSettingsExtensions store={mockStore({})} />
            </TraderProviders>
        );
    };

    it('should not render anything, but call populateSettingsExtensions', () => {
        const { container } = render(mockTradeSettingsExtensions());

        expect(default_mock_store.ui.populateSettingsExtensions).toBeCalled();
        expect(container).toBeEmptyDOMElement();
    });
});
