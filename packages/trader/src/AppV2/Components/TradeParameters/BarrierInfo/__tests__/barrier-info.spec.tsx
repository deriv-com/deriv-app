import React from 'react';
import { render, screen } from '@testing-library/react';
import BarrierInfo from '../barrier-info';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import { CONTRACT_TYPES } from '@deriv/shared';

const barrier_label = 'Barrier';

describe('<BarrierInfo />', () => {
    let default_mock_store: ReturnType<typeof mockStore>, default_mock_prop: React.ComponentProps<typeof BarrierInfo>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    ...mockStore({}),
                    barrier_1: '1.2345',
                    contract_type: 'turboslong',
                },
            },
        });
        default_mock_prop = { is_disabled: false };
    });

    const mockedBarrierInfo = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <BarrierInfo {...default_mock_prop} />
            </TraderProviders>
        );

    it('does not render if there is an API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            [CONTRACT_TYPES.TURBOS.LONG]: {
                has_error: true,
            },
        };
        const { container } = mockedBarrierInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('renders loader if barrier_1 is falsy but there is no API error', () => {
        default_mock_store.modules.trade.barrier_1 = '';
        mockedBarrierInfo();

        expect(screen.getByText(barrier_label)).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText('1.2345')).not.toBeInTheDocument();
    });

    it('renders correct barrier value', () => {
        mockedBarrierInfo();

        const barrier = screen.getByText(barrier_label);
        expect(barrier).toBeInTheDocument();
        expect(barrier).not.toHaveClass('trade-params__text--disabled');
        expect(screen.getByText('1.2345')).toBeInTheDocument();
    });

    it('applies specific className if is_disabled === true', () => {
        default_mock_prop.is_disabled = true;
        mockedBarrierInfo();

        expect(screen.getByText(barrier_label)).toHaveClass('trade-params__text--disabled');
    });
});
