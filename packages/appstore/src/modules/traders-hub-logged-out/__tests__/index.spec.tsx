import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render } from '@testing-library/react';
import TradersHubLoggedOut from '..';

jest.mock('Components/modals/modal-manager', () => jest.fn(() => 'mockedModalManager'));
jest.mock('Components/main-title-bar', () => jest.fn(() => 'mockedMainTitleBar'));
jest.mock('Components/cfds-listing', () => jest.fn(() => 'mockedCFDsListing'));
jest.mock('Components/options-multipliers-listing', () => jest.fn(() => 'mocked<OptionsAndMultipliersListing>'));
jest.mock('../../tour-guide/tour-guide', () => jest.fn(() => 'mocked<TourGuide>'));

describe('TradersHub', () => {
    const render_container = (mock_store_override = {}) => {
        const mock_store = mockStore(mock_store_override);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );

        return render(<TradersHubLoggedOut />, {
            wrapper,
        });
    };

    it('should display the component', () => {
        const { container } = render_container();
        expect(container).toBeInTheDocument();
    });
});
