import { cleanup, render, waitFor, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PersonalDetailsForm } from '../personal-details-form';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

afterAll(cleanup);
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    WS: {
        wait: (...payload: []) => Promise.resolve([...payload]),
    },
    useWS: () => undefined,
}));

describe('<PersonalDetailsForm />', () => {
    const history = createBrowserHistory();

    const promise = Promise.resolve();
    const fetchResidenceList = jest.fn(() => promise);
    const fetchStatesList = jest.fn(() => promise);
    const residence_list = [
        {
            text: 'Text',
            value: 'value',
        },
    ];
    const mock_store = mockStore({
        client: {
            account_settings: {
                first_name: 'John',
                place_of_birth: 'Thailand',
                citizen: 'Thailand',
                email_consent: 1,
            },
            states_list: residence_list,
            residence_list,
            has_residence: true,
            fetchResidenceList,
            fetchStatesList,
        },
    });

    const renderComponent = (modified_store = mock_store) => {
        return render(
            <Router history={history}>
                <StoreProvider store={modified_store}>
                    <PersonalDetailsForm history={history} />
                </StoreProvider>
            </Router>
        );
    };

    it('should render successfully', async () => {
        renderComponent();
        expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
        await waitFor(() => {
            expect(
                screen.getByText(
                    /Please make sure your information is correct or it may affect your trading experience./i
                )
            ).toBeInTheDocument();
        });
    });

    it('should render all the personal details fields', () => {
        renderComponent();
        const fields = [
            'First name*',
            'Last name*',
            'Date of birth*',
            'Country of residence*',
            'Phone number*',
            'First line of address*',
            'Second line of address (optional)',
            'Town/City*',
            'State/Province (optional)',
            'Postal/ZIP code',
        ];
        fields.forEach(value => {
            expect(screen.getByText(value)).toBeInTheDocument();
        });
    });

    it('should have "required" validation errors on required form fields', async () => {
        renderComponent();

        await waitFor(() => {
            const first_name = screen.getByTestId('dt_first_name');
            userEvent.clear(first_name);
            expect(screen.getByText(/First name is required./)).toBeInTheDocument();
        });
    });

    it('should display error for 2-50 characters length validation, for First name when entered characters are less than 2', async () => {
        renderComponent();
        await waitFor(() => {
            const last_name = screen.getByTestId('dt_last_name');
            userEvent.type(last_name, 'b');
            expect(screen.getByText(/You should enter 2-50 characters./)).toBeInTheDocument();
        });
    });

    it('should display error for the regex validation, for First name when unacceptable characters are entered', async () => {
        renderComponent();

        await waitFor(() => {
            const first_name = screen.getByTestId('dt_first_name');
            userEvent.type(first_name, 'test 3');
            expect(screen.getByText('Letters, spaces, periods, hyphens, apostrophes only.')).toBeInTheDocument();
        });
    });

    it('should not display error for the regex validation, for First name when acceptable characters are entered', async () => {
        renderComponent();
        await waitFor(() => {
            const first_name = screen.getByTestId('dt_first_name');
            userEvent.type(first_name, "test-with' chars.");
            expect(screen.queryByText('Letters, spaces, periods, hyphens, apostrophes only.')).not.toBeInTheDocument();
        });
    });

    it('should render professional client if support_professional_client is true with not verified account', () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        renderComponent();
        const professional_client_text = [
            /Professional Client/,
            /By default, all Deriv.com clients are retail clients but anyone can request to be treated as a professional client./,
            /A professional client receives a lower degree of client protection due to the following./,
            /We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risk involved./,
            /We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings./,
            /You’ll need to authenticate your account before requesting to become a professional client./,
            /Authenticate my account/,
        ];
        professional_client_text.forEach(value => {
            expect(screen.getByText(value)).toBeInTheDocument();
        });
        const auth_text = screen.getByText(/Authenticate my account/);
        const auth_link = auth_text.getAttribute('href');
        expect(auth_link).toBe('/account/proof-of-identity');
    });

    it('should render POI auth link', () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        renderComponent();
        const auth_text = screen.getByText(/Authenticate my account/);
        const auth_link = auth_text.getAttribute('href');
        expect(auth_link).toBe('/account/proof-of-identity');
    });

    it('should render POA auth link', () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        mock_store.client.authentication_status.identity_status = 'verified';
        renderComponent();
        const auth_text = screen.getByText(/Authenticate my account/);
        const auth_link = auth_text.getAttribute('href');
        expect(auth_link).toBe('/account/proof-of-address');
    });

    it('should render professional client if support_professional_client is true with verified account', () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        mock_store.client.authentication_status.document_status = 'verified';
        mock_store.client.authentication_status.identity_status = 'verified';
        renderComponent();
        expect(
            screen.getByRole('checkbox', { name: /I would like to be treated as a professional client./ })
        ).toBeInTheDocument();
    });

    it('should update user profile after clicking on submit', () => {
        renderComponent();
        const first_name = screen.getByTestId('dt_first_name') as HTMLInputElement;
        expect(first_name.value).toBe('John');
        userEvent.clear(first_name);
        userEvent.type(first_name, 'James');
        const submit_button = screen.getByRole('button', { name: /Submit/ });
        userEvent.click(submit_button);
        expect(first_name.value).toBe('James');
    });

    it('should only display country of residence if isVirtual is true', () => {
        mock_store.client.is_virtual = true;
        renderComponent();
        const exceptional_fields = [
            'First name*',
            'Last name*',
            'Place of birth',
            'Date of birth*',
            'Citizenship',
            'Phone number*',
            'First line of address*',
            'Second line of address (optional)',
            'Town/City*',
            'State/Province (optional)',
            'Postal/ZIP code',
        ];
        exceptional_fields.forEach(value => {
            expect(screen.queryByText(value)).not.toBeInTheDocument();
        });
        expect(screen.getByText('Country of residence*')).toBeInTheDocument();
    });
});
