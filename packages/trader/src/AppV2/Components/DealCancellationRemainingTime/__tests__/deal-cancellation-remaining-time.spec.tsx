import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatDuration, getDiffDuration } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import DealCancellationRemainingTime from '../deal-cancellation-remaining-time';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatDuration: jest.fn(),
    getDiffDuration: jest.fn(),
}));

jest.mock('@deriv/stores', () => ({
    observer: jest.fn(component => component),
    useStore: jest.fn(),
}));

jest.mock('AppV2/Hooks/useContractDetails', () => jest.fn());

describe('DealCancellationRemainingTime component', () => {
    const cancellation_badge_testid = 'dt_deal_cancellation_badge';
    const mockCommon = {
        server_time: {
            unix: () => 1623441000,
        },
    };

    beforeEach(() => {
        (useStore as jest.Mock).mockReturnValue({ common: mockCommon });
    });

    it('renders the remaining time tag when end time is after start time', () => {
        const mockContractInfo = {
            cancellation: {
                date_expiry: 1623441600,
            },
        };

        (useContractDetails as jest.Mock).mockReturnValue({ contract_info: mockContractInfo });

        (getDiffDuration as jest.Mock).mockReturnValue({ hours: 0, minutes: 5, seconds: 0 });
        (formatDuration as jest.Mock).mockReturnValue({ timestamp: '05:00', format: 'mm:ss' });

        render(<DealCancellationRemainingTime />);

        expect(screen.getByText('05:00')).toBeInTheDocument();
        expect(screen.getByTestId(cancellation_badge_testid)).toBeInTheDocument();
    });

    it('does not render the remaining time tag when end time is before start time', () => {
        const mockContractInfo = {
            cancellation: {
                date_expiry: 1623440000,
            },
        };

        (useContractDetails as jest.Mock).mockReturnValue({ contract_info: mockContractInfo });

        render(<DealCancellationRemainingTime />);

        expect(screen.queryByText('05:00')).not.toBeInTheDocument();
        expect(screen.queryByTestId(cancellation_badge_testid)).not.toBeInTheDocument();
    });

    it('does not render the remaining time tag when there is no cancellation date', () => {
        const mockContractInfo = {
            cancellation: undefined,
        };

        (useContractDetails as jest.Mock).mockReturnValue({ contract_info: mockContractInfo });

        render(<DealCancellationRemainingTime />);

        expect(screen.queryByText('05:00')).not.toBeInTheDocument();
        expect(screen.queryByTestId(cancellation_badge_testid)).not.toBeInTheDocument();
    });
});
