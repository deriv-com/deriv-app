import { initFormErrorMessages } from '@deriv/shared';
import { jest, test } from '@jest/globals';
import React from 'react';
import { cleanup, render, waitForElementToBeRemoved, waitFor, screen, fireEvent, act } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PersonalDetailsForm } from '../personal-details.jsx';
import { StoreProvider, mockStore } from '@deriv/stores';

afterAll(cleanup);

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
    useWS: () => undefined,
}));

describe('<PersonalDetailsForm />', () => {
    const history = createBrowserHistory();
    const mock_props = {
        authentication_status: {},
        is_eu: true,
        is_mf: false,
        is_uk: false,
        is_svg: false,
        is_virtual: false,
        residence_list: [{}],
        states_list: [],
        refreshNotifications: jest.fn(),
        showPOAAddressMismatchSuccessNotification: jest.fn(),
        showPOAAddressMismatchFailureNotification: jest.fn(),
        Notifications: '',
        fetchResidenceList: jest.fn(),
        fetchStatesList: jest.fn(),
        has_residence: false,
        account_settings: {},
        getChangeableFields: jest
            .fn()
            .mockReturnValue(['first_name', 'last_name', 'phone', 'address_line_1', 'address_city']),
        current_landing_company: {},
        history: {},
        is_social_signup: false,
        updateAccountStatus: jest.fn(),
        has_poa_address_mismatch: false,
        is_language_changing: false,
    };

    const promise = Promise.resolve();
    const fetchResidenceList = jest.fn(() => promise);
    const fetchStatesList = jest.fn(() => promise);
    const residence_list = [
        {
            text: 'Text',
            value: 'value',
        },
    ];
    let store = mockStore({
        client: {
            account_settings: {
                email_consent: 1,
            },
            is_virtual: false,
            states_list: residence_list,
            residence_list: residence_list,
            has_residence: true,
            getChangeableFields: () => [],
            fetchResidenceList: fetchResidenceList,
            fetchStatesList: fetchStatesList,
        },
    });

    const renderComponent = (modified_store = store) => {
        return render(
            <Router history={history}>
                <StoreProvider store={modified_store}>
                    <PersonalDetailsForm />
                </StoreProvider>
            </Router>
        );
    };

    it('should_render_successfully', async () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        const screen = renderComponent();

        await waitForElementToBeRemoved(() => screen.container.querySelector('.account__initial-loader'));
        await waitFor(() =>
            screen.getByText(/Please make sure your information is correct or it may affect your trading experience./i)
        );
    });

    it('should render all the personal details fields', async () => {
        const new_store = {
            ...store,
            client: {
                ...store.client,
                is_eu: true,
            },
        };
        renderComponent(new_store);

        await waitFor(() => {
            expect(screen.queryByText('First name*')).toBeInTheDocument();
            expect(screen.queryByText('Last name*')).toBeInTheDocument();
            expect(screen.queryByText('Place of birth*')).toBeInTheDocument();
            expect(screen.queryByText('Date of birth*')).toBeInTheDocument();
            expect(screen.queryByText('Citizenship*')).toBeInTheDocument();
            expect(screen.queryByText('Country of residence*')).toBeInTheDocument();
            expect(screen.queryByText('Phone number*')).toBeInTheDocument();
            expect(screen.queryByText('First line of address*')).toBeInTheDocument();
            expect(screen.queryByText('Second line of address (optional)')).toBeInTheDocument();
            expect(screen.queryByText('Town/City*')).toBeInTheDocument();
            expect(screen.queryByText('State/Province (optional)')).toBeInTheDocument();
            expect(screen.queryByText('Postal/ZIP code')).toBeInTheDocument();
        });
    });

    it('should display label "Place of birth" without asterisk if is_svg is true', async () => {
        const new_store = {
            ...store,
            client: {
                ...store.client,
                is_svg: true,
            },
        };
        renderComponent(new_store);

        await waitFor(() => {
            expect(screen.queryByText('Place of birth')).toBeInTheDocument();
        });
    });

    it('should display label "Citizenship" without asterisk if is_eu is false', async () => {
        const new_store = {
            ...store,
            client: {
                ...store.client,
                is_eu: false,
            },
        };
        renderComponent(new_store);
        await waitFor(() => {
            expect(screen.queryByText('Citizenship')).toBeInTheDocument();
        });
    });

    it('should have "required" validation errors on required form fields', async () => {
        const form_error_messages = {
            empty_address: () => 'This field is required',
        };
        initFormErrorMessages(form_error_messages);
        renderComponent();

        await waitFor(async () => {
            const first_name = screen.getByTestId('dt_first_name');
            const last_name = screen.getByTestId('dt_last_name');
            const phone = screen.getByTestId('dt_phone');
            const address_line_1 = screen.getByTestId('dt_address_line_1');
            const address_city = screen.getByTestId('dt_address_city');
            fireEvent.blur(first_name);
            fireEvent.blur(last_name);
            fireEvent.blur(phone);
            fireEvent.blur(address_line_1);
            fireEvent.blur(address_city);
        });
        expect(screen.getAllByText('This field is required')).toHaveLength(5);
    });

    it('should display error for 2-50 characters length validation, for First and Last name when entered characters are less than 2', async () => {
        renderComponent();
        await waitFor(async () => {
            const first_name = screen.getByTestId('dt_first_name');
            const last_name = screen.getByTestId('dt_last_name');
            fireEvent.input(first_name, { target: { value: 'a' } });
            fireEvent.input(last_name, { target: { value: 'b' } });
        });

        expect(screen.getAllByText('You should enter 2-50 characters.')).toHaveLength(2);
    });

    it('should display error for 2-50 characters length validation, for First and Last name when entered characters are more than 50', async () => {
        renderComponent();
        await waitFor(async () => {
            const first_name = screen.getByTestId('dt_first_name');
            const last_name = screen.getByTestId('dt_last_name');
            fireEvent.input(first_name, { target: { value: 'fifty chars fifty chars fifty chars fifty chars fifty' } });
            fireEvent.input(last_name, { target: { value: 'fifty chars fifty chars fifty chars fifty chars fifty' } });
        });
        expect(screen.getAllByText('You should enter 2-50 characters.')).toHaveLength(2);
    });

    it('should display error for the regex validation, for First and Last name when unacceptable characters are entered', async () => {
        renderComponent();

        await waitFor(async () => {
            const first_name = screen.getByTestId('dt_first_name');
            const last_name = screen.getByTestId('dt_last_name');
            fireEvent.input(first_name, { target: { value: 'test 3' } });
            fireEvent.input(last_name, { target: { value: 'name_' } });
            expect(screen.getAllByText('Letters, spaces, periods, hyphens, apostrophes only.')).toHaveLength(2);
            fireEvent.input(first_name, { target: { value: 'name_' } });
            fireEvent.input(last_name, { target: { value: 'test 3' } });
            expect(screen.getAllByText('Letters, spaces, periods, hyphens, apostrophes only.')).toHaveLength(2);
        });
    });

    it('should not display error for the regex validation, for First and Last name when acceptable characters are entered', async () => {
        renderComponent();
        await waitFor(async () => {
            const first_name = screen.getByTestId('dt_first_name');
            const last_name = screen.getByTestId('dt_last_name');
            fireEvent.input(first_name, { target: { value: "test-with' chars." } });
            fireEvent.input(last_name, { target: { value: 'Deuxième Prénom résidence' } });
            expect(screen.queryByText('Letters, spaces, periods, hyphens, apostrophes only.')).not.toBeInTheDocument();
            fireEvent.input(first_name, { target: { value: 'Deuxième Prénom résidence' } });
            fireEvent.input(last_name, { target: { value: "test-with' chars." } });
            expect(screen.queryByText('Letters, spaces, periods, hyphens, apostrophes only.')).not.toBeInTheDocument();
        });
    });

    test.todo('Personal details component tests for different landing companies');
    test.todo('Personal detail update Profile');
});
