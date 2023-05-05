import { jest, test } from '@jest/globals';
import React from 'react';
import { cleanup, render, waitForElementToBeRemoved, waitFor, screen, fireEvent } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PersonalDetailsForm } from '../personal-details.jsx';

afterAll(cleanup);

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
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

    renderComponent = (modified_props = {}) => {
        const updated_props = {
            ...mock_props,
            ...modified_props,
        };
        render(
            <Router history={history}>
                <PersonalDetailsForm {...updated_props} />
            </Router>
        );
    };

    it('should_render_successfully', async () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();

        const promise = Promise.resolve();
        const fetchResidenceList = jest.fn(() => promise);
        const fetchStatesList = jest.fn(() => promise);
        const residence_list = [
            {
                text: 'Text',
                value: 'value',
            },
        ];
        const screen = render(
            <Router history={history}>
                <PersonalDetailsForm
                    fetchResidenceList={fetchResidenceList}
                    fetchStatesList={fetchStatesList}
                    residence_list={residence_list}
                    has_residence={true}
                    account_settings={{
                        email_consent: 1,
                    }}
                    getChangeableFields={() => []}
                    is_virtual={false}
                    states_list={residence_list}
                />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.container.querySelector('.account__initial-loader'));
        await waitFor(() =>
            screen.getByText(/Please make sure your information is correct or it may affect your trading experience./i)
        );
    });

    it('should render all the personal details fields', async () => {
        renderComponent();
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
        renderComponent({ is_svg: true });
        await waitFor(() => {
            expect(screen.queryByText('Place of birth')).toBeInTheDocument();
        });
    });

    it('should display label "Citizenship" without asterisk if is_eu is false', async () => {
        renderComponent({ is_eu: false });
        await waitFor(() => {
            expect(screen.queryByText('Citizenship')).toBeInTheDocument();
        });
    });

    it('should have "required" validation errors on required form fields', async () => {
        renderComponent();
        await waitFor(async () => {
            const first_name = screen.getByTestId('first_name');
            const last_name = screen.getByTestId('last_name');
            const phone = screen.getByTestId('phone');
            const address_line_1 = screen.getByTestId('address_line_1');
            const address_city = screen.getByTestId('address_city');
            fireEvent.blur(first_name);
            fireEvent.blur(last_name);
            fireEvent.blur(phone);
            fireEvent.blur(address_line_1);
            fireEvent.blur(address_city);
        });
        expect(screen.getAllByText('This field is required')).toHaveLength(5);
    });

    test.todo('Personal details component tests for different landing companies');
    test.todo('Personal detail update Profile');
});
