import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';
import ToggleAds from '../toggle-ads';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        setApiError: jest.fn(),
        api_error: '',
    },
    general_store: {
        is_barred: false,
        is_listed: 1,
        setIsListed: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));

describe('<ToggleAds/>', () => {
    it('should render the ToggleAds component', () => {
        render(<ToggleAds />);

        expect(screen.getByText('Hide my ads')).toBeInTheDocument();
    });
    it('should set error message when error occurs during toggling ads', async () => {
        (requestWS as jest.Mock).mockResolvedValue({ error: { message: 'Some error' } });
        render(<ToggleAds />);

        expect(screen.getByText('Hide my ads')).toBeInTheDocument();

        const toggle = screen.getByRole('checkbox');
        userEvent.click(toggle);

        expect(requestWS).toBeCalledWith({ p2p_advertiser_update: 1, is_listed: 0 });
        await waitFor(() => expect(mocked_store_values.my_ads_store.setApiError).toBeCalledWith('Some error'));
    });
    it('should call setIsListed function when toggling ads and there is no error', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            general_store: { ...mocked_store_values.general_store, is_listed: 0 },
        });
        (requestWS as jest.Mock).mockResolvedValue({ p2p_advertiser_update: { is_listed: 0 } });
        render(<ToggleAds />);

        expect(screen.getByText('Hide my ads')).toBeInTheDocument();

        const toggle = screen.getByRole('checkbox');
        userEvent.click(toggle);

        expect(requestWS).toBeCalledWith({ p2p_advertiser_update: 1, is_listed: 1 });
        await waitFor(() => expect(mocked_store_values.general_store.setIsListed).toBeCalledWith(false));
    });
});
