import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SelfExclusion from '../self-exclusion';
import { FormikValues } from 'formik';

const portal_root = document.createElement('div');
document.body.appendChild(portal_root);

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => (Component: React.Component) => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));

jest.mock('../self-exclusion-modal', () => {
    const MockSelfExclusionModal = () => <div>SelfExclusionModal</div>;
    return MockSelfExclusionModal;
});

describe('<SelfExclusion />', () => {
    let mock_props = {
        currency: '',
        footer_ref: undefined,
        is_app_settings: false,
        is_appstore: false,
        is_cr: false,
        is_eu: false,
        is_mf: false,
        is_mlt: false,
        is_mx: false,
        is_switching: false,
        is_tablet: false,
        is_uk: false,
        is_virtual: false,
        is_wrapper_bypassed: false,
        logout: jest.fn(),
        overlay_ref: document.createElement('div'),
        setIsOverlayShown: jest.fn(),
        ws: {
            authorized: {
                getLimits: () =>
                    Promise.resolve({
                        get_limits: {},
                    }),
                getSelfExclusion: () =>
                    Promise.resolve({
                        error: { message: '' },
                    }),
                setSelfExclusion: () =>
                    Promise.resolve({
                        error: {},
                    }),
            },
        },
    };

    beforeEach(() => {
        mock_props = {
            currency: 'Test currency',
            footer_ref: undefined,
            is_app_settings: false,
            is_appstore: false,
            is_cr: false,
            is_eu: false,
            is_mf: false,
            is_mlt: false,
            is_mx: false,
            is_switching: false,
            is_tablet: false,
            is_uk: false,
            is_virtual: false,
            is_wrapper_bypassed: false,
            logout: jest.fn(),
            overlay_ref: document.createElement('div'),
            setIsOverlayShown: jest.fn(),
            ws: {
                authorized: {
                    getLimits: () =>
                        Promise.resolve({
                            get_limits: {},
                        }),
                    getSelfExclusion: () =>
                        Promise.resolve({
                            error: { message: '' },
                        }),
                    setSelfExclusion: () =>
                        Promise.resolve({
                            error: {},
                        }),
                },
            },
        };
    });

    it('should render SelfExclusion component for virtual account', () => {
        mock_props.is_virtual = true;

        render(<SelfExclusion {...mock_props} />);

        expect(screen.getByText('This feature is not available for demo accounts.')).toBeInTheDocument();
    });

    it('should render SelfExclusion component with SelfExclusionModal', async () => {
        await act(async () => {
            render(<SelfExclusion {...mock_props} />);
        });

        expect(screen.getByText('SelfExclusionModal')).toBeInTheDocument();
        const currencies = screen.getAllByText(/Test currency/i);
        expect(currencies[0]).toBeInTheDocument();
        expect(currencies.length).toBe(7);
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(11);
    });

    it('should render SelfExclusion component with error', async () => {
        mock_props.ws.authorized.getSelfExclusion = () =>
            Promise.resolve({
                error: { message: 'Test getSelfExclusion response error' },
            });

        await act(async () => {
            render(<SelfExclusion {...mock_props} />);
        });

        expect(screen.queryByText('Test getSelfExclusion response error')).toBeInTheDocument();
    });

    it('Should trigger session_duration_limit input and show error if the value is greater than 60480 or does not show if less than 60480', async () => {
        mock_props.is_eu = true;

        render(<SelfExclusion {...mock_props} />);

        const inputs = await screen.findAllByRole('textbox');
        const session_duration_limit_input = inputs.find(
            (input: FormikValues) => input.name === 'session_duration_limit'
        );

        await act(async () => {
            if (session_duration_limit_input)
                fireEvent.change(session_duration_limit_input, { target: { value: '60481' } });
        });

        expect(
            screen.getByText('Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).')
        ).toBeInTheDocument();

        await act(async () => {
            if (session_duration_limit_input)
                fireEvent.change(session_duration_limit_input, { target: { value: '60479' } });
        });

        expect(
            screen.queryByText('Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).')
        ).not.toBeInTheDocument();
    });

    it('Should trigger exclude_until input and show error depends on input value', async () => {
        (Date.now as jest.Mock) = jest.fn(() => new Date('2022-02-03'));

        render(<SelfExclusion {...mock_props} />);

        const inputs = await screen.findAllByRole('textbox');
        const exclude_until_input = inputs.find((input: FormikValues) => input.name === 'exclude_until');

        await act(async () => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2021-04-13' } });
        });

        expect(screen.getByText('Exclude time must be after today.')).toBeInTheDocument();

        await act(async () => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2022-04-13' } });
        });
        expect(screen.getByText('Exclude time cannot be less than 6 months.')).toBeInTheDocument();

        await act(async () => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2028-04-13' } });
        });
        expect(screen.getByText('Exclude time cannot be for more than five years.')).toBeInTheDocument();
    });

    it('should trigger inputs with data, add new data, and show error wih invalid input data', async () => {
        mock_props.ws.authorized.setSelfExclusion = () =>
            Promise.resolve({
                error: { message: 'Test setSelfExclusion response error' },
            });

        await act(async () => {
            render(<SelfExclusion {...mock_props} />);
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        const next_btn_1 = screen.getByRole('button');
        expect(next_btn_1).toHaveTextContent('Next');

        const inputs_1 = await screen.findAllByRole('textbox');
        expect(inputs_1.length).toBe(11);
        const max_turnover_input = inputs_1.find((input: FormikValues) => input.name === 'max_turnover');
        const max_open_bets_input = inputs_1.find((input: FormikValues) => input.name === 'max_open_bets');

        act(() => {
            if (max_turnover_input) fireEvent.change(max_turnover_input, { target: { value: '1700' } });
            if (max_open_bets_input) fireEvent.change(max_open_bets_input, { target: { value: '999' } });
        });

        await waitFor(() => {
            fireEvent.click(next_btn_1);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        const accept_btn_1 = screen.getByRole('button');
        expect(accept_btn_1).toHaveTextContent('Accept');
        expect(next_btn_1).not.toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const back_btn_1 = screen.getByText('Back');
        expect(back_btn_1).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(back_btn_1);
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        expect(screen.queryByText('You have set the following limits:')).not.toBeInTheDocument();
        expect(accept_btn_1).not.toBeInTheDocument();
        const next_btn_2 = screen.getByRole('button');
        expect(next_btn_2).toHaveTextContent('Next');
        const inputs_2 = await screen.findAllByRole('textbox');
        expect(inputs_2.length).toBe(11);
        const max_balance_input = inputs_1.find((input: FormikValues) => input.name === 'max_balance');

        act(() => {
            if (max_balance_input) fireEvent.change(max_balance_input, { target: { value: '10000' } });
        });

        await waitFor(() => {
            fireEvent.click(next_btn_2);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const accept_btn_2 = screen.getByRole('button');
        expect(accept_btn_2).toHaveTextContent('Accept');

        await waitFor(() => {
            fireEvent.click(accept_btn_2);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const back_btn_2 = screen.getByText('Back');
        expect(back_btn_2).toBeInTheDocument();
        const accept_btn_3 = screen.getByRole('button');
        expect(accept_btn_3).toHaveTextContent('Accept');
        expect(screen.getByText('Test setSelfExclusion response error')).toBeInTheDocument();
    });

    it('should trigger inputs with correct data set timeout limit and logout', async () => {
        mock_props.ws.authorized.setSelfExclusion = () =>
            Promise.resolve({
                error: false,
            });

        const logout = mock_props.logout;

        await act(async () => {
            render(<SelfExclusion {...mock_props} />);
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        const next_btn_1 = screen.getByRole('button');
        expect(next_btn_1).toHaveTextContent('Next');

        const inputs = await screen.findAllByRole('textbox');
        expect(inputs.length).toBe(11);

        const exclude_until_input = inputs.find((input: FormikValues) => input.name === 'exclude_until');
        const max_open_bets_input = inputs.find((input: FormikValues) => input.name === 'max_open_bets');
        const max_losses_input = inputs.find((input: FormikValues) => input.name === 'max_losses');
        const max_turnover_input = inputs.find((input: FormikValues) => input.name === 'max_turnover');
        const max_7day_losses_input = inputs.find((input: FormikValues) => input.name === 'max_7day_losses');
        const max_7day_turnover_input = inputs.find((input: FormikValues) => input.name === 'max_7day_turnover');
        const max_30day_losses_input = inputs.find((input: FormikValues) => input.name === 'max_30day_losses');
        const max_30day_turnover_input = inputs.find((input: FormikValues) => input.name === 'max_30day_turnover');
        const session_duration_limit_input = inputs.find(
            (input: FormikValues) => input.name === 'session_duration_limit'
        );

        act(() => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2023-02-03' } });
            if (max_open_bets_input) fireEvent.change(max_open_bets_input, { target: { value: '99' } });
            if (max_losses_input) fireEvent.change(max_losses_input, { target: { value: '1000' } });
            if (max_turnover_input) fireEvent.change(max_turnover_input, { target: { value: '1700' } });
            if (max_7day_losses_input) fireEvent.change(max_7day_losses_input, { target: { value: '700' } });
            if (max_7day_turnover_input) fireEvent.change(max_7day_turnover_input, { target: { value: '700' } });
            if (max_30day_losses_input) fireEvent.change(max_30day_losses_input, { target: { value: '3000' } });
            if (max_30day_turnover_input) fireEvent.change(max_30day_turnover_input, { target: { value: '5000' } });
            if (session_duration_limit_input)
                fireEvent.change(session_duration_limit_input, { target: { value: '60399' } });
        });

        await waitFor(() => {
            fireEvent.click(next_btn_1);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        expect(next_btn_1).not.toBeInTheDocument();
        const accept_btn_1 = screen.getByRole('button');
        expect(accept_btn_1).toHaveTextContent('Accept');

        await waitFor(() => {
            fireEvent.click(accept_btn_1);
        });

        expect(accept_btn_1).not.toBeInTheDocument();
        const review_btn = screen.getByText('No, review my limits');
        expect(review_btn).toBeInTheDocument();

        expect(screen.getByText('Yes, log me out immediately')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(review_btn);
        });

        expect(screen.queryByText('Yes, log me out immediately')).not.toBeInTheDocument();
        expect(review_btn).not.toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();

        const accept_btn_2 = screen.getByRole('button');
        expect(accept_btn_2).toHaveTextContent('Accept');

        await waitFor(() => {
            fireEvent.click(accept_btn_2);
        });

        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        const logout_btn = screen.getByText('Yes, log me out immediately');
        expect(logout_btn).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(logout_btn);
        });

        expect(logout).toHaveBeenCalled();
    });
});
