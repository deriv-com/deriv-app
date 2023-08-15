import React from 'react';
import { render, screen } from '@testing-library/react';
import IconTradeCategory from '../icon-trade-categories';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'MockedIcon'),
}));

describe('<IconTradeCatgory />', () => {
    const mocked_icon = 'MockedIcon';
    it('Expect empty div to be rendered when category is empty', () => {
        render(<IconTradeCategory category='' />);
        const categories_container = screen.getByTestId('dt-categories-container');
        expect(categories_container).toBeInTheDocument();
        expect(categories_container).toHaveClass('categories-container');
        expect(categories_container).toHaveTextContent('');
    });
    it('Expect MockedIcon to be rendered when category is rise_fall', () => {
        render(<IconTradeCategory category='rise_fall' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is rise_fall_equal', () => {
        render(<IconTradeCategory category='rise_fall_equal' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is high_low', () => {
        render(<IconTradeCategory category='high_low' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is end', () => {
        render(<IconTradeCategory category='end' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is stay', () => {
        render(<IconTradeCategory category='stay' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is match_diff', () => {
        render(<IconTradeCategory category='match_diff' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is even_odd', () => {
        render(<IconTradeCategory category='even_odd' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is over_under', () => {
        render(<IconTradeCategory category='over_under' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is touch', () => {
        render(<IconTradeCategory category='touch' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is asian', () => {
        render(<IconTradeCategory category='asian' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect MockedIcon to be rendered when category is lb_call', () => {
        render(<IconTradeCategory category='lb_call' />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect MockedIcon to be rendered when category is lb_put', () => {
        render(<IconTradeCategory category='lb_put' />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect MockedIcon to be rendered when category is lb_high_low', () => {
        render(<IconTradeCategory category='lb_high_low' />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect two MockedIcons to be rendered when category is run_high_low', () => {
        render(<IconTradeCategory category='run_high_low' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is reset', () => {
        render(<IconTradeCategory category='reset' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is tick_high_low', () => {
        render(<IconTradeCategory category='tick_high_low' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is callputspread', () => {
        render(<IconTradeCategory category='callputspread' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect two MockedIcons to be rendered when category is multiplier', () => {
        render(<IconTradeCategory category='multiplier' />);
        const mocked_icons = screen.getAllByText(mocked_icon);
        expect(mocked_icons).toHaveLength(2);
        mocked_icons.forEach(icon => {
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('category-wrapper');
        });
    });
    it('Expect MockedIcon to be rendered when category is accumulator', () => {
        render(<IconTradeCategory category='accumulator' />);
        const mocked_icon_text = screen.getByText(mocked_icon);
        expect(mocked_icon_text).toBeInTheDocument();
        expect(mocked_icon_text).toHaveClass('category-wrapper');
    });
    it('Expect two MockedIcons to be rendered when category is vanilla', () => {
        render(<IconTradeCategory category='vanilla' />);
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
