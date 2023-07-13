import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import MyAds from '../my-ads';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        error_message: '',
        getAccountStatus: jest.fn(),
        is_loading: false,
        setIsLoading: jest.fn(),
        setShowAdForm: jest.fn(),
        setShowEditAdForm: jest.fn(),
        show_ad_form: false,
        show_edit_ad_form: false,
    },
    general_store: {
        is_advertiser: true,
        is_restricted: false,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('Components/Verification', () => jest.fn(() => <div>Verification</div>));

jest.mock('../my-ads-content', () => jest.fn(() => <div>MyAdsContent</div>));
jest.mock('../create-ad', () => jest.fn(() => <div>CreateAd</div>));
jest.mock('../edit-ad', () => jest.fn(() => <div>EditAd</div>));

describe('<MyAds/>', () => {
    it('should render the MyAds component', () => {
        render(<MyAds />);

        expect(screen.getByText('MyAdsContent')).toBeInTheDocument();
    });
    it('should display Loading component when in loading state', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: { ...mocked_store_values.my_ads_store, is_loading: true },
        });

        render(<MyAds />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
    it('should display error when api throws error', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: { ...mocked_store_values.my_ads_store, error_message: 'i am an error' },
        });

        render(<MyAds />);

        expect(screen.getByText('i am an error')).toBeInTheDocument();
    });
    it('should display the restriction text when p2p is restrictd in the country', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            general_store: { ...mocked_store_values.general_store, is_restricted: true },
        });

        render(<MyAds />);

        expect(screen.getByText('Deriv P2P cashier is unavailable in your country.')).toBeInTheDocument();
    });
    it('should display the create ad form if user is an advertiser and show_ad_form is true', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: { ...mocked_store_values.my_ads_store, show_ad_form: true },
        });

        render(<MyAds />);

        expect(screen.getByText('CreateAd')).toBeInTheDocument();
    });
    it('should display the edit ad form if user is an advertiser and show_edit_ad_form is true', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: { ...mocked_store_values.my_ads_store, show_edit_ad_form: true },
        });

        render(<MyAds />);

        expect(screen.getByText('EditAd')).toBeInTheDocument();
    });
    it('should display Verification component if user is not an advertiser', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            general_store: { ...mocked_store_values.general_store, is_advertiser: false },
        });

        render(<MyAds />);

        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
});
