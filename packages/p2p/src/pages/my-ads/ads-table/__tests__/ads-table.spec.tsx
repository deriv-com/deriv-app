import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import AdsTable from '../ads-table';
import { adverts } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        is_barred: 0,
        is_listed: 1,
    },
    my_ads_store: {
        adverts,
        has_more_items_to_load: false,
        loadMoreAds: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

describe('<AdsTable/>', () => {
    it('should render the AdsTable component', () => {
        render(
            <StoreProvider store={mock}>
                <AdsTable />
            </StoreProvider>
        );

        expect(screen.getByText('Ad ID')).toBeInTheDocument();
        expect(screen.getByText('Limits')).toBeInTheDocument();
        expect(screen.getByText('Rate (1 USD)')).toBeInTheDocument();
        expect(screen.getByText('Available amount')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
    });
});
