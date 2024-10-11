import React from 'react';
import { render, screen } from '@testing-library/react';
import Digit from '../digit';

describe('Digit', () => {
    const mock_props = {
        digit: 5,
        digit_stats: [120, 86, 105, 94, 85, 86, 124, 107, 90, 103],
        is_active: false,
        is_disabled: false,
        is_max: false,
        is_min: false,
        onClick: jest.fn(),
    };
    const percentage_testid = 'dt_digit_stats_percentage';

    it('should not render digit if digit is passed as undefined despite the type restriction', () => {
        const { container } = render(<Digit {...mock_props} digit={undefined as unknown as number} />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should render skeleton loader if digit_stats is empty', () => {
        render(<Digit {...mock_props} digit_stats={[]} />);

        expect(screen.getByTestId('square-skeleton')).toBeInTheDocument();
    });
    it('should render an enabled digit button with stats if digit and digit_stats are defined', () => {
        render(<Digit {...mock_props} />);

        expect(screen.getByRole('button', { name: '5' })).toBeEnabled();
        expect(screen.getByText('8.6%')).toBeInTheDocument();
    });
    it('should render digit button without stats is digit_stats for the digit is not available', () => {
        render(<Digit {...mock_props} digit_stats={[]} />);

        expect(screen.getByRole('button', { name: '5' })).toBeEnabled();
        expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });
    it('should render a disabled digit button if is_disabled={true}', () => {
        render(<Digit {...mock_props} is_disabled />);

        expect(screen.getByRole('button', { name: '5' })).toBeDisabled();
    });
    it('should render a digit button with correct classname if is_active={true}', () => {
        render(<Digit {...mock_props} is_active />);

        expect(screen.getByRole('button', { name: '5' })).toHaveClass('active');
    });
    it('should render percentage with correct classname if is_min={true}', () => {
        render(<Digit {...mock_props} is_min />);

        expect(screen.getByTestId(percentage_testid)).toHaveClass('percentage--min');
    });
    it('should render percentage with correct classname if is_max={true}', () => {
        render(<Digit {...mock_props} is_max />);

        expect(screen.getByTestId(percentage_testid)).toHaveClass('percentage--max');
    });
});
