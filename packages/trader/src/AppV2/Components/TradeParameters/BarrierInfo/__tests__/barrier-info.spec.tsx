import React from 'react';
import { render, screen } from '@testing-library/react';
import BarrierInfo from '../barrier-info';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import { CONTRACT_TYPES } from '@deriv/shared';

describe('<BarrierInfo />', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        barrier_1: '1.2345',
                        contract_type: 'turboslong',
                    },
                },
            }))
    );

    const mockedBarrierInfo = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <BarrierInfo />
            </TraderProviders>
        );

    it('should not render if there is API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            [CONTRACT_TYPES.TURBOS.LONG]: {
                has_error: true,
            },
        };
        const { container } = mockedBarrierInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('should render loader if barrier_1 is falsy but there is no API error', () => {
        default_mock_store.modules.trade.barrier_1 = '';
        mockedBarrierInfo();

        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText('1.2345')).not.toBeInTheDocument();
    });

    it('should render correct barrier value', () => {
        mockedBarrierInfo();

        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.getByText('1.2345')).toBeInTheDocument();
    });
});
