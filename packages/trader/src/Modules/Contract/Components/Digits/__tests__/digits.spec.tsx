import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, mockContractInfo, TRADE_TYPES } from '@deriv/shared';
import Digits from '../digits';
import { useDevice } from '@deriv-com/ui';

const tick_information_text = /Tick/i;
const mocked_digit_spot = 'DigitSpot';
const mocked_last_digit_prediction = 'LastDigitPrediction';

jest.mock('App/Components/Animations', () => ({
    ...jest.requireActual('App/Components/Animations'),
    Bounce: jest.fn(({ children }) => <div>{children}</div>),
    SlideIn: jest.fn(({ children, is_visible }) => (is_visible ? <div>{children}</div> : null)),
}));
jest.mock('../../LastDigitPrediction', () => ({
    ...jest.requireActual('../../LastDigitPrediction'),
    DigitSpot: jest.fn(({ current_spot, is_selected_winning, is_won }) => (
        <div>
            {mocked_digit_spot}
            <div>Spot:{current_spot}</div>
            <div>{is_selected_winning ? 'Selected winning' : null}</div>
            <div>{is_won ? 'Won' : null}</div>
        </div>
    )),
    LastDigitPrediction: jest.fn(({ onLastDigitSpot }) => (
        <div>
            {mocked_last_digit_prediction}
            <button
                onClick={() =>
                    onLastDigitSpot({ spot: '2361.35', is_lost: false, is_selected_winning: true, is_won: true })
                }
            >
                Set spot
            </button>
        </div>
    )),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn(() => () => true),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false, isDesktop: true })),
}));

describe('<Digits />', () => {
    let mocked_props: React.ComponentProps<typeof Digits>;
    beforeEach(() => {
        mocked_props = {
            contract_info: mockContractInfo({
                tick_stream: [
                    {
                        epoch: 1700203489,
                        tick: 2361.33,
                        tick_display_value: '2361.33',
                    },
                    {
                        epoch: 1700203490,
                        tick: 2361.35,
                        tick_display_value: '2361.35',
                    },
                ],
            }),
            digits_array: [90, 107, 105, 94, 100, 96, 96, 101, 105, 97],
            digits_info: {},
            is_trade_page: true,
            onDigitChange: jest.fn(),
            selected_digit: 5,
            tick: {
                ask: 2098.19,
                bid: 2097.59,
                epoch: 1702018845,
                id: '3f5bbd16-2a03-1eb7-c872-1aac45ef25ff',
                pip_size: 2,
                quote: 2097.89,
                symbol: '1HZ100V',
            },
            trade_type: TRADE_TYPES.MATCH_DIFF,
            underlying: '1HZ100V',
            is_mobile: false,
        };
    });

    it('should render <LastDigitPrediction /> with tooltip with text for desktop if is_trade_page === true', () => {
        render(<Digits {...mocked_props} />);

        expect(screen.getByText(mocked_last_digit_prediction)).toBeInTheDocument();

        const popover = screen.getByTestId('dt_popover_wrapper');
        expect(popover).toBeInTheDocument();

        userEvent.hover(popover);
        expect(
            screen.getByText('Last digit stats for latest 1000 ticks for Volatility 100 (1s) Index')
        ).toBeInTheDocument();
    });
    it('should render <LastDigitPrediction /> without tooltip for desktop if is_trade_page === false', () => {
        mocked_props.is_trade_page = false;
        render(<Digits {...mocked_props} />);

        expect(screen.getByText(mocked_last_digit_prediction)).toBeInTheDocument();
        expect(screen.queryByTestId('dt_popover_wrapper')).not.toBeInTheDocument();
    });
    it('should not render anything for desktop if digits_array and is_digit_contract are falsy', () => {
        mocked_props.digits_array = undefined;
        render(<Digits {...mocked_props} />);

        expect(screen.queryByText(mocked_last_digit_prediction)).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_popover_wrapper')).not.toBeInTheDocument();
    });
    it('should render tick information text, <DigitSpot/> and <LastDigitPrediction /> for mobile if is_trade_page === true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<Digits {...mocked_props} />);

        expect(screen.getByText(tick_information_text)).toBeInTheDocument();
        expect(screen.getByText(mocked_digit_spot)).toBeInTheDocument();
        expect(screen.getByText(mocked_last_digit_prediction)).toBeInTheDocument();
    });
    it('onLastDigitSpot function call should set new properties in <DigitSpot />', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<Digits {...mocked_props} />);

        expect(screen.getByText('Spot:')).toBeInTheDocument();
        expect(screen.queryByText('Selected winning')).not.toBeInTheDocument();
        expect(screen.queryByText('Won')).not.toBeInTheDocument();

        userEvent.click(screen.getByText('Set spot'));

        expect(screen.getByText('Spot:2361.35')).toBeInTheDocument();
        expect(screen.getByText('Selected winning')).toBeInTheDocument();
        expect(screen.getByText('Won')).toBeInTheDocument();
    });
});
