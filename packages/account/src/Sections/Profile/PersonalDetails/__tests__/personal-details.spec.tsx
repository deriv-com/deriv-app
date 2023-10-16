import React from 'react';
import { PersonalDetailsForm } from '../personal-details';
import { StoreProvider, mockStore } from '@deriv/stores';
import { createBrowserHistory } from 'history';
import { screen } from '@testing-library/react';
import { useSettings } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSettings: jest.fn(),
}));

const mockedUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;

const mock_settings: ReturnType<typeof useSettings> = {
    update: jest.fn(),
    mutation: { isLoading: false, isSuccess: false, error: null, isError: false },
    data: {
        tax_identification_number: '',
        tax_residence: '',
        place_of_birth: '',
        account_opening_reason: '',
    },
};

describe('PersonalDetailsForm', () => {
    const mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const history = createBrowserHistory();

    const renderComponent = () => {
        <StoreProvider store={mock_store}>
            <PersonalDetailsForm history={history} />
        </StoreProvider>;
    };

    it('should render PersonalDetailsForm', () => {
        mockedUseSettings.mockReturnValue(mock_settings);
        mock_store.ui.is_mobile = true;
        renderComponent();
    });
});
