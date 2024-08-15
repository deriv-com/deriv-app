import React from 'react';
import { render, screen } from '@testing-library/react';
import BarrierInfo from '../barrier-info';
import TraderProviders from '../../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';

describe('<BarrierInfo />', () => {
    const mock_store = {
        modules: {
            trade: {
                barrier_1: '1.2345',
            },
        },
    };

    const MockedBarrierInfo = (mocked_store: TCoreStores, is_minimized: boolean) => {
        return (
            <TraderProviders store={mocked_store}>
                <BarrierInfo is_minimized={is_minimized} />
            </TraderProviders>
        );
    };

    it('displays the correct barrier value', () => {
        render(MockedBarrierInfo(mockStore(mock_store), false));
        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.getByText('1.2345')).toBeInTheDocument();
    });
});
