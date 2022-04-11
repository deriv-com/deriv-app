import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { requestWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import ToggleAds from '../toggle-ads.jsx';

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn(),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mocked_my_ads_store = {
    api_error: '',
    setApiError: jest.fn(),
};

const mocked_general_store = {
    is_barred: false,
    is_listed: false,
    setIsListed: jest.fn(),
};

describe('<CreateAdErrorModal />', () => {
    it('Component should be rendered with proper ads status', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: mocked_general_store,
        }));
        render(<ToggleAds />);

        const el_dp2p_ads_paused_status = screen.getByText('Your ads are paused');
        expect(el_dp2p_ads_paused_status).toBeInTheDocument();
    });

    it('Component should be rendered with proper ads status', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: { ...mocked_general_store, is_listed: true },
        }));
        render(<ToggleAds />);

        const el_dp2p_ads_running_status = screen.getByText('Your ads are running');
        expect(el_dp2p_ads_running_status).toBeInTheDocument();
    });

    it('Api error must be set if toggling ads and there is response error', async () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: mocked_general_store,
        }));
        requestWS.mockImplementation(() => Promise.resolve({ error: { message: 'test' } }));
        render(<ToggleAds />);

        const el_dp2p_ads_status_checkbox = screen.getByRole('checkbox');
        fireEvent.click(el_dp2p_ads_status_checkbox);

        await waitFor(() => {
            expect(mocked_my_ads_store.setApiError).toHaveBeenCalledWith('test');
        });
    });

    it('User should be listed or unlisted when toggling ads and no response error', async () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: mocked_general_store,
        }));
        requestWS.mockImplementation(() => Promise.resolve({ p2p_advertiser_update: { is_listed: 0 }, error: null }));
        render(<ToggleAds />);

        const el_dp2p_ads_status_checkbox = screen.getByRole('checkbox');
        fireEvent.click(el_dp2p_ads_status_checkbox);

        await waitFor(() => {
            expect(mocked_general_store.setIsListed).toHaveBeenCalledWith(false);
        });
    });
});
