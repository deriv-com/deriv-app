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

    const MockedBarrierInfo = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <BarrierInfo />
            </TraderProviders>
        );
    };

    it('displays the correct barrier value', () => {
        render(MockedBarrierInfo(mockStore(mock_store)));
        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.getByText('1.2345')).toBeInTheDocument();
    });
});
