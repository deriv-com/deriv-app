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
const mockedNumberSelector = 'Mocked Number Selector Component';
const digitPrediction = 'Last Digit Prediction';
const lastDigit = `Last Digit: ${default_mock_store.modules.trade.last_digit}`;

jest.mock('App/Components/Form/number-selector', () => jest.fn(() => <div>{mockedNumberSelector}</div>));
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

        expect(screen.getByText(lastDigit)).toBeInTheDocument();
        expect(screen.queryByText(mockedNumberSelector)).not.toBeInTheDocument();
        expect(screen.queryByText(digitPrediction)).not.toBeInTheDocument();
    });
    it('should render fieldset and number selector if is_minimizes is false', () => {
        render(mockLastDigit(mockStore(default_mock_store)));

        expect(screen.getByText(mockedNumberSelector)).toBeInTheDocument();
        expect(screen.getByText(digitPrediction)).toBeInTheDocument();
        expect(screen.queryByText(lastDigit)).not.toBeInTheDocument();
    });
    it('should not render fieldset header if it is not desktop', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        render(mockLastDigit(mockStore(default_mock_store)));

        expect(screen.queryByText(digitPrediction)).not.toBeInTheDocument();
    });
});
