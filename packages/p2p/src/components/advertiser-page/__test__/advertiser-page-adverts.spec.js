import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useStores } from 'Stores';
import { isDesktop, isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import AdvertiserPageAdverts from '../advertiser-page-adverts.jsx';

const mock_advertiser_page_store = {
    active_index: 0,
    is_loading_adverts: false,
    adverts: [],
    has_more_adverts_to_load: true,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        advertiser_page_store: {
            showAdPopup: jest.fn(),
            handleTabItemClick: jest.fn(),
            loadMoreAdvertiserAdverts: jest.fn(),
            ...mock_advertiser_page_store,
        },
        general_store: {
            client: { currency: 'AED' },
        },
    })),
}));

jest.mock('Components/advertiser-page/advertiser-page-row.jsx', () =>
    jest.fn(() => <div>AdvertiserPageRow component</div>)
);

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div>Loading</div>),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<AdvertiserPageAdverts/>', () => {
    it('should render 2 tabs on component load', () => {
        render(
            <BrowserRouter>
                <AdvertiserPageAdverts />
            </BrowserRouter>
        );

        expect(screen.getAllByRole('listitem').length).toBe(2);
    });

    it('should render empty component if no adverts are available', () => {
        render(
            <BrowserRouter>
                <AdvertiserPageAdverts />
            </BrowserRouter>
        );

        expect(screen.getByText('No ads')).toBeInTheDocument();
    });

    it('should render table header in desktop mode', () => {
        useStores.mockReturnValue({
            advertiser_page_store: {
                showAdPopup: jest.fn(),
                handleTabItemClick: jest.fn(),
                loadMoreAdvertiserAdverts: jest.fn(),
                ...{ ...mock_advertiser_page_store, adverts: [{}, {}] },
            },
            general_store: {
                client: { currency: 'AED' },
            },
        });
        render(
            <BrowserRouter>
                <AdvertiserPageAdverts />
            </BrowserRouter>
        );

        expect(screen.getAllByRole('columnheader').length).toBe(4);
        expect(screen.getByText('Limits')).toBeInTheDocument();
        expect(screen.getByText('Rate (1 AED)')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
    });

    it('should render only table body in mobile devices', () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);

        render(
            <BrowserRouter>
                <AdvertiserPageAdverts />
            </BrowserRouter>
        );

        expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
        expect(screen.getAllByRole('rowgroup').length).toBe(1);
    });

    it('should render loading component when is_loading status is true', () => {
        useStores.mockReturnValue({
            advertiser_page_store: {
                showAdPopup: jest.fn(),
                handleTabItemClick: jest.fn(),
                loadMoreAdvertiserAdverts: jest.fn(),
                ...{ ...mock_advertiser_page_store, is_loading_adverts: true },
            },
            general_store: {
                client: { currency: 'AED' },
            },
        });
        render(
            <BrowserRouter>
                <AdvertiserPageAdverts />
            </BrowserRouter>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
