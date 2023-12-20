import React from 'react';
import { screen, render } from '@testing-library/react';
import TraderProviders from '../../../trader-providers';
import PopulateHeader from '../populate-header';
import { mockStore } from '@deriv/stores';
import { CONTRACT_TYPES } from '@deriv/shared';

jest.mock('../../Components/Elements/TogglePositions/toggle-positions-mobile', () =>
    jest.fn(() => <div>MockedTogglePositionsMobile</div>)
);

describe('<PopulateHeader />', () => {
    let mock_store: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                client: {
                    currency: 'USD',
                },
                portfolio: {
                    active_positions_count: 5,
                    all_positions: [
                        {
                            contract_info: {
                                underlying: 'test symbol',
                                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                                entry_spot: 9454.1,
                                contract_id: 1,
                                shortcode: 'test',
                                profit: 100,
                            },
                        },
                        {
                            contract_info: {
                                underlying: 'test symbol',
                                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                                entry_spot: 9467.78,
                                contract_id: 2,
                                shortcode: 'test',
                                profit: 120,
                            },
                        },
                    ],
                    error: '',
                    onClickSell: jest.fn(),
                    onClickCancel: jest.fn(),
                },
            }),
        };
    });
    const renderPopulateHeader = (mocked_store: ReturnType<typeof mockStore>) => {
        return render(
            <TraderProviders store={mocked_store}>
                <PopulateHeader />
            </TraderProviders>
        );
    };
    it('Should render mocked toggle positions mobile', () => {
        renderPopulateHeader(mock_store);
        expect(screen.getByText('MockedTogglePositionsMobile')).toBeInTheDocument();
    });
});
