import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import IconTradeCategory from '../icon-trade-categories';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'MockedIcon'),
}));

describe('<IconTradeCategory />', () => {
    const mocked_icon = 'MockedIcon';
    it('Expect empty div to be rendered when category is empty', () => {
        render(<IconTradeCategory category='' />);
        const categories_container = screen.getByTestId('dt-categories-container');
        expect(categories_container).toBeInTheDocument();
        expect(categories_container).toHaveClass('categories-container');
        expect(categories_container).toHaveTextContent('');
    });
    it('Expect MockedIcon to be rendered when category is TRADE_TYPES.RISE_FALL', () => {
        render(<IconTradeCategory category={TRADE_TYPES.RISE_FALL} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.RISE_FALL_EQUAL', () => {
        render(<IconTradeCategory category={TRADE_TYPES.RISE_FALL_EQUAL} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.HIGH_LOW', () => {
        render(<IconTradeCategory category={TRADE_TYPES.HIGH_LOW} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.END', () => {
        render(<IconTradeCategory category={TRADE_TYPES.END} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.STAY', () => {
        render(<IconTradeCategory category={TRADE_TYPES.STAY} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.MATCH_DIFF', () => {
        render(<IconTradeCategory category={TRADE_TYPES.MATCH_DIFF} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.EVEN_ODD', () => {
        render(<IconTradeCategory category={TRADE_TYPES.EVEN_ODD} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.OVER_UNDER', () => {
        render(<IconTradeCategory category={TRADE_TYPES.OVER_UNDER} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.TOUCH', () => {
        render(<IconTradeCategory category={TRADE_TYPES.TOUCH} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.ASIAN', () => {
        render(<IconTradeCategory category={TRADE_TYPES.ASIAN} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect MockedIcon to be rendered when category is TRADE_TYPES.LB_CALL', () => {
        render(<IconTradeCategory category={TRADE_TYPES.LB_CALL} />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect MockedIcon to be rendered when category is TRADE_TYPES.LB_PUT', () => {
        render(<IconTradeCategory category={TRADE_TYPES.LB_PUT} />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect MockedIcon to be rendered when category is TRADE_TYPES.LB_HIGH_LOW', () => {
        render(<IconTradeCategory category={TRADE_TYPES.LB_HIGH_LOW} />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.RUN_HIGH_LOW', () => {
        render(<IconTradeCategory category={TRADE_TYPES.RUN_HIGH_LOW} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.RESET', () => {
        render(<IconTradeCategory category={TRADE_TYPES.RESET} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.TICK_HIGH_LOW', () => {
        render(<IconTradeCategory category={TRADE_TYPES.TICK_HIGH_LOW} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.CALL_PUT_SPREAD', () => {
        render(<IconTradeCategory category={TRADE_TYPES.CALL_PUT_SPREAD} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.MULTIPLIER', () => {
        render(<IconTradeCategory category={TRADE_TYPES.MULTIPLIER} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect MockedIcon to be rendered when category is TRADE_TYPES.ACCUMULATOR', () => {
        render(<IconTradeCategory category={TRADE_TYPES.ACCUMULATOR} />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.VANILLA.CALL', () => {
        render(<IconTradeCategory category={TRADE_TYPES.VANILLA.CALL} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is TRADE_TYPES.TURBOS.LONG', () => {
        render(<IconTradeCategory category={TRADE_TYPES.TURBOS.LONG} />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect default case to be rendered when category is not valid', () => {
        render(<IconTradeCategory category='some_trade_type' />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
});
