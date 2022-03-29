import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelfExclusion from '../self-exclusion';
import { act } from 'react-dom/test-utils';

const portalRoot = document.createElement('div');
document.body.appendChild(portalRoot);

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));

jest.mock('../self-exclusion-modal', () => () => <div>SelfExclusionModal</div>);

describe('<SelfExclusion />', () => {
    let mockProps = {};

    beforeEach(() => {
        mockProps = {
            currency: 'Test currency',
            footer_ref: portalRoot,
            is_app_settings: false,
            is_cr: false,
            is_appstore: false,
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
            overlay_ref: {},
            setIsOverlayShown: jest.fn(),
            ws: {
                authorized: {
                    setSelfExclusion: () =>
                        Promise.resolve({
                            error: { message: '' },
                        }),
                    getSelfExclusion: () =>
                        Promise.resolve({
                            error: { message: '' },
                        }),
                    getLimits: () =>
                        Promise.resolve({
                            get_limits: jest.fn(),
                        }),
                },
            },
        };
    });

    it('should render SelfExclusion component for virtual account', async () => {
        mockProps.is_virtual = true;

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        expect(screen.getByText('This feature is not available for demo accounts.')).toBeInTheDocument();
    });

    it('should render SelfExclusion component with SelfExclusionModal', async () => {
        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        expect(screen.getByText('SelfExclusionModal')).toBeInTheDocument();
        const testCurrency = screen.getAllByText(/Test currency/i);
        expect(testCurrency[0]).toBeInTheDocument();
        expect(testCurrency.length).toBe(7);
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(11);
    });

    it('should render SelfExclusion component with error', async () => {
        mockProps.ws.authorized.getSelfExclusion = () =>
            Promise.resolve({
                error: { message: 'Test getSelfExclusion response error' },
            });

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        expect(screen.queryByText('Test getSelfExclusion response error')).toBeInTheDocument();
    });

    it('Should trigger session_duration_limit input and show error if the value is greater than 60480 or does not show if less than 60480', async () => {
        mockProps.is_eu = true;

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        const inputs = await screen.findAllByRole('textbox');
        const session_duration_limit_input = inputs.find(input => input.name === 'session_duration_limit');

        await act(async () => {
            fireEvent.change(session_duration_limit_input, { target: { value: '60481' } });
        });

        expect(
            screen.getByText('Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).')
        ).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(session_duration_limit_input, { target: { value: '60479' } });
        });
        expect(
            screen.queryByText('Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).')
        ).not.toBeInTheDocument();
    });

    it('Should trigger exclude_until input and show error depends on input value', async () => {
        Date.now = jest.fn(() => new Date('2022-02-03'));

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        const inputs = await screen.findAllByRole('textbox');
        const exclude_until_input = inputs.find(input => input.name === 'exclude_until');

        await act(async () => {
            fireEvent.change(exclude_until_input, { target: { value: '2021-04-13' } });
        });

        expect(screen.getByText('Exclude time must be after today.')).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(exclude_until_input, { target: { value: '2022-04-13' } });
        });
        expect(screen.getByText('Exclude time cannot be less than 6 months.')).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(exclude_until_input, { target: { value: '2028-04-13' } });
        });
        expect(screen.getByText('Exclude time cannot be for more than five years.')).toBeInTheDocument();
    });

    it('should trigger inputs with data, add new data, and show error wih invalid input data', async () => {
        mockProps.ws.authorized.setSelfExclusion = () =>
            Promise.resolve({
                error: { message: 'Test setSelfExclusion response error' },
            });

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        const btnNext1 = screen.getByRole('button');
        expect(btnNext1).toHaveTextContent('Next');

        const inputs = await screen.findAllByRole('textbox');
        expect(inputs.length).toBe(11);
        const max_turnover_input = inputs.find(input => input.name === 'max_turnover');
        const max_open_bets_input = inputs.find(input => input.name === 'max_open_bets');

        act(() => {
            fireEvent.change(max_turnover_input, { target: { value: '1700' } });
            fireEvent.change(max_open_bets_input, { target: { value: '999' } });
        });

        await waitFor(() => {
            fireEvent.click(btnNext1);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        const btnAccept1 = screen.getByRole('button');
        expect(btnAccept1).toHaveTextContent('Accept');
        expect(btnNext1).not.toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const backBtn1 = screen.getByText('Back');
        expect(backBtn1).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(backBtn1);
        });

        expect(screen.queryByText('You have set the following limits:')).not.toBeInTheDocument();
        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        expect(btnAccept1).not.toBeInTheDocument();
        const btnNext2 = screen.getByRole('button');
        expect(btnNext2).toHaveTextContent('Next');
        const inputs2 = await screen.findAllByRole('textbox');
        expect(inputs2.length).toBe(11);
        const max_balance_input = inputs.find(input => input.name === 'max_balance');

        act(() => {
            fireEvent.change(max_balance_input, { target: { value: '10000' } });
        });

        await waitFor(() => {
            fireEvent.click(btnNext2);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const btnAccept2 = screen.getByRole('button');
        expect(btnAccept2).toHaveTextContent('Accept');

        await waitFor(() => {
            fireEvent.click(btnAccept2);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const backBtn2 = screen.getByText('Back');
        expect(backBtn2).toBeInTheDocument();
        const btnAccept3 = screen.getByRole('button');
        expect(btnAccept3).toHaveTextContent('Accept');
        expect(screen.getByText('Test setSelfExclusion response error')).toBeInTheDocument();
    });

    it('should trigger inputs with correct data set timeout limit and logout', async () => {
        mockProps.ws.authorized.setSelfExclusion = () =>
            Promise.resolve({
                error: false,
            });

        const logout = mockProps.logout;

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        const btnNext1 = screen.getByRole('button');
        expect(btnNext1).toHaveTextContent('Next');

        const inputs = await screen.findAllByRole('textbox');
        expect(inputs.length).toBe(11);
        const max_turnover_input = inputs.find(input => input.name === 'max_turnover');
        const max_losses_input = inputs.find(input => input.name === 'max_losses');
        const max_7day_turnover_input = inputs.find(input => input.name === 'max_7day_turnover');
        const max_7day_losses_input = inputs.find(input => input.name === 'max_7day_losses');
        const max_30day_turnover_input = inputs.find(input => input.name === 'max_30day_turnover');
        const max_30day_losses_input = inputs.find(input => input.name === 'max_30day_losses');
        const session_duration_limit_input = inputs.find(input => input.name === 'session_duration_limit');
        const exclude_until_input = inputs.find(input => input.name === 'exclude_until');
        const max_open_bets_input = inputs.find(input => input.name === 'max_open_bets');

        act(() => {
            fireEvent.change(max_turnover_input, { target: { value: '1700' } });
            fireEvent.change(max_losses_input, { target: { value: '1000' } });
            fireEvent.change(max_7day_turnover_input, { target: { value: '700' } });
            fireEvent.change(max_7day_losses_input, { target: { value: '700' } });
            fireEvent.change(max_30day_turnover_input, { target: { value: '5000' } });
            fireEvent.change(max_30day_losses_input, { target: { value: '3000' } });
            fireEvent.change(session_duration_limit_input, { target: { value: '60399' } });
            fireEvent.change(exclude_until_input, { target: { value: '2023-02-03' } });
            fireEvent.change(max_open_bets_input, { target: { value: '99' } });
        });

        await waitFor(() => {
            fireEvent.click(btnNext1);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        expect(btnNext1).not.toBeInTheDocument();
        const btnAccept1 = screen.getByRole('button');
        expect(btnAccept1).toHaveTextContent('Accept');

        await waitFor(() => {
            fireEvent.click(btnAccept1);
        });

        expect(btnAccept1).not.toBeInTheDocument();
        const reviewBtn = screen.getByText('No, review my limits');
        expect(reviewBtn).toBeInTheDocument();

        expect(screen.getByText('Yes, log me out immediately')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(reviewBtn);
        });

        expect(screen.queryByText('Yes, log me out immediately')).not.toBeInTheDocument();
        expect(reviewBtn).not.toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();

        const btnAccept2 = screen.getByRole('button');
        expect(btnAccept2).toHaveTextContent('Accept');

        await waitFor(() => {
            fireEvent.click(btnAccept2);
        });

        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        const logoutBtn = screen.getByText('Yes, log me out immediately');
        expect(logoutBtn).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(logoutBtn);
        });

        expect(logout).toHaveBeenCalledTimes(1);
    });
});
