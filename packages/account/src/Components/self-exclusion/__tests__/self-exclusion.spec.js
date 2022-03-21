import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    validNumber: jest.fn().mockReturnValue(() => ({})),
}));

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
                        error: { message: 'Test setSelfExclusion response error' },
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

describe('<SelfExclusion />', () => {
    it('should render SelfExclusion component for virtual account', async () => {
        mockProps.is_virtual = true;

        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        expect(screen.getByText('This feature is not available for demo accounts.')).toBeInTheDocument();
    });

    it('should render SelfExclusion component', async () => {
        await act(async () => {
            render(<SelfExclusion {...mockProps} />);
        });

        const testCurrency = screen.getAllByText(/Test currency/i);
        expect(testCurrency[0]).toBeInTheDocument();
        expect(testCurrency.length).toBeGreaterThan(0);
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);
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

    it('Should trigger session_duration_limit input and show error if the value is greater than 60480', async () => {
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
});
