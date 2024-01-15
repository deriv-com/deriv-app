import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsAmountMobile from '../accumulators-amount-mobile';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../../trader-providers';

const default_mock_store = {
    modules: {
        trade: {
            amount: 10,
            currency: 'USD',
            onChange: jest.fn(),
            has_open_accu_contract: false,
        },
    },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => true),
}));

describe('<AccumulatorsAmountMobile />', () => {
    const mockAccumulatorsAmountMobile = mocked_store => {
        return (
            <TraderProviders store={mocked_store}>
                <AccumulatorsAmountMobile />
            </TraderProviders>
        );
    };
    it('should render child <LabeledQuantityInputMobile /> component', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockAccumulatorsAmountMobile(mock_root_store));

        expect(screen.getByText(/Stake/i)).toBeInTheDocument();
    });
    it('should render child <LabeledQuantityInputMobile /> component with inline prefix if is_single_currency is true', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.client = { is_single_currency: true };
        const mock_root_store = mockStore(new_mock_store);
        render(mockAccumulatorsAmountMobile(mock_root_store));

        expect(screen.getByText(/Stake/i)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });
});
