import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { isDesktop } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';
import LastDigit from '../last-digit';

const default_mock_store = {
    modules: {
        trade: {
            onChange: jest.fn(),
            last_digit: 5,
        },
    },
};
const mocked_number_selector = 'Mocked Number Selector Component';
const digit_prediction = 'Last Digit Prediction';
const last_digit = `Last Digit: ${default_mock_store.modules.trade.last_digit}`;

jest.mock('App/Components/Form/number-selector', () => jest.fn(() => <div>{mocked_number_selector}</div>));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn().mockReturnValue(true),
}));

describe('<LastDigit />', () => {
    const mockLastDigit = (mocked_store: TCoreStores, mocked_props?: React.ComponentProps<typeof LastDigit>) => {
        return (
            <TraderProviders store={mocked_store}>
                <LastDigit {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render only phrase about last digit if is_minimizes is true', () => {
        render(mockLastDigit(mockStore(default_mock_store), { is_minimized: true }));

        expect(screen.getByText(last_digit)).toBeInTheDocument();
        expect(screen.queryByText(mocked_number_selector)).not.toBeInTheDocument();
        expect(screen.queryByText(digit_prediction)).not.toBeInTheDocument();
    });
    it('should render fieldset and number selector if is_minimizes is false', () => {
        render(mockLastDigit(mockStore(default_mock_store)));

        expect(screen.getByText(mocked_number_selector)).toBeInTheDocument();
        expect(screen.getByText(digit_prediction)).toBeInTheDocument();
        expect(screen.queryByText(last_digit)).not.toBeInTheDocument();
    });
    it('should not render fieldset header if it is not desktop', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        render(mockLastDigit(mockStore(default_mock_store)));

        expect(screen.queryByText(digit_prediction)).not.toBeInTheDocument();
    });
});
