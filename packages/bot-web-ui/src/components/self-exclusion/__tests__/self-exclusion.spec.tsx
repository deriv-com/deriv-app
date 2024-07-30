import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import SelfExclusion, { SelfExclusionForm } from '../self-exclusion';
import { Formik } from 'formik';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

const mocked_props = {
    is_onscreen_keyboard_active: true,
    is_logged_in: true,
    initial_values: {
        run_limit: 5,
        form_max_losses: 5,
    },
    api_max_losses: 1000,
    onRunButtonClick: jest.fn(),
    resetSelfExclusion: jest.fn(),
    updateSelfExclusion: jest.fn(),
    setRunLimit: jest.fn(),
    is_mobile: true,
};

const mocked_prop_self_exclusion = {
    onRunButtonClick: jest.fn(),
};
const mockOnSubmit = jest.fn();
const mockValidate = jest.fn();

describe('SelfExclusionForm', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={mocked_props.initial_values} onSubmit={mockOnSubmit} validate={mockValidate}>
                        <Router>{children}</Router>
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('check if form elements are present', () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        expect(screen.getByLabelText('Daily loss limit')).toBeInTheDocument();
        expect(screen.getByLabelText('Maximum consecutive trades')).toBeInTheDocument();
        expect(screen.getByText('Apply and run')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('the form should be submit-able and updateSelfExclusion() method should be called upon submission.', async () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(mocked_props.updateSelfExclusion).toHaveBeenCalled();
        });
    });

    it('the form should be submit-able and updateSelfExclusion() method should be called upon submission, along with displaying the correct error message.', async () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        mocked_props.updateSelfExclusion.mockResolvedValue({ error: { message: 'Simulated error message' } });
        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Simulated error message'));
        });
    });

    it('the form should display the empty values for the "run_limit" and "form_max_losses" fields if they are submitted without being filled in.', async () => {
        render(<SelfExclusionForm {...mocked_props} initial_values={{}} />, { wrapper });

        const run_limit = screen.getByTestId('run_limit');
        const form_max_losses = screen.getByTestId('form_max_losses');

        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);
        //validation begins when the input field is touched.
        userEvent.type(run_limit, ' ');

        await waitFor(() => {
            expect(run_limit).toHaveValue(' ');
            expect(form_max_losses).toHaveValue('');
        });
    });

    it('the form should display the correct error message when submitted with a negative number value in the form_max_losses field.', async () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        const form_max_losses = screen.getByTestId('form_max_losses');
        userEvent.type(form_max_losses, '-5');

        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Should be a valid number')).toBeInTheDocument();
        });
    });

    it('the form should display the correct error message when submitted with a value that exceeds the maximum character limit in the form_max_losses field.', async () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        const form_max_losses = screen.getByTestId('form_max_losses');
        userEvent.type(form_max_losses, '99999999999991');

        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Please enter a number between 0 and 1000.')).toBeInTheDocument();
        });
    });

    it('should display the correct error message, when the form is submitted with a non-integer value in the run_limit field', async () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        const run_limit = screen.getByTestId('run_limit');
        userEvent.type(run_limit, 'text');

        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Should be a valid number')).toBeInTheDocument();
        });
    });

    it('should display the correct error message, when the form is submitted with a decimal value with more than 2 digits after the dot in the form_max_losses field', async () => {
        render(<SelfExclusionForm {...mocked_props} />, { wrapper });

        const form_max_losses = screen.getByTestId('form_max_losses');
        userEvent.type(form_max_losses, '0.12345');

        const submit_button = screen.getByRole('button', { name: 'Apply and run' });
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText(/Reached maximum number of decimals/i)).toBeInTheDocument();
        });
    });

    it('the is_restricted value should be falsy when is_logged_in is false', () => {
        render(<SelfExclusionForm {...mocked_props} is_logged_in={false} />, { wrapper });

        expect(mock_DBot_store?.self_exclusion.is_restricted).toBeFalsy();
    });
});

describe('SelfExclusion', () => {
    let modal_root_el: HTMLElement,
        wrapper: ({ children }: { children: JSX.Element }) => JSX.Element,
        mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_store.client.is_logged_in = true;
        mock_DBot_store?.self_exclusion.setIsRestricted(true);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={mocked_props.initial_values} onSubmit={mockOnSubmit} validate={mockValidate}>
                        <Router>{children}</Router>
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('renders the desktop version of SelfExclusionForm component when on desktop, is_restricted and is_logged_in equal true', () => {
        mock_store.ui.is_desktop = true;
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        render(<SelfExclusion {...mocked_prop_self_exclusion} />, { wrapper });

        expect(screen.getByTestId('self-exclusion')).toHaveClass('db-self-exclusion');
        expect(
            screen.queryByRole('button', { name: /Cancel/i }) &&
                screen.queryByRole('button', { name: /Apply and run/i })
        ).toBeInTheDocument();
    });

    it('renders the desktop version of SelfExclusionForm component when on mobile, is_restricted and is_logged_in equal true, modal opens', () => {
        mock_store.ui.is_desktop = false;

        render(<SelfExclusion {...mocked_prop_self_exclusion} />, { wrapper });

        expect(screen.getByText('Limits')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: /Cancel/i }) &&
                screen.queryByRole('button', { name: /Apply and run/i })
        ).toBeInTheDocument();
    });

    it('make is_restricted falsy upon clicking the cancel button', () => {
        render(<SelfExclusion {...mocked_prop_self_exclusion} />, { wrapper });

        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        userEvent.click(cancelButton);

        expect(mock_DBot_store?.self_exclusion.is_restricted).toBeFalsy();
    });
});
