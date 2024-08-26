import React from 'react';
import { render, screen } from '@testing-library/react';
import MultipliersExpirationInfo from '../multipliers-expiration-info';
import TraderProviders from '../../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import { formatDuration, getDateFromNow, getDiffDuration } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatDuration: jest.fn(),
    getDateFromNow: jest.fn(),
    getDiffDuration: jest.fn(),
}));

describe('<MultipliersExpirationInfo />', () => {
    const mock_store = {
        modules: {
            trade: {
                expiration: 1626188400,
            },
        },
        common: {
            server_time: {
                unix: () => 1626174000,
            },
        },
    };

    const MockedMultipliersExpirationInfo = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <MultipliersExpirationInfo />
            </TraderProviders>
        );
    };

    it('displays the correct expiration date and time', () => {
        (formatDuration as jest.Mock).mockReturnValue({ days: 1, timestamp: '14:00' });
        (getDateFromNow as jest.Mock).mockReturnValue('13 Jul 2021');
        (getDiffDuration as jest.Mock).mockReturnValue(14400);
        render(MockedMultipliersExpirationInfo(mockStore(mock_store)));

        expect(screen.getByText('Expires on')).toBeInTheDocument();
        expect(screen.getByText('13 Jul 2021 at 14:00')).toBeInTheDocument();
    });
});
