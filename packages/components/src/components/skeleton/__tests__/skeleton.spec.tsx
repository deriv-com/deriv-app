import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton, { VARIANT } from '../skeleton';

describe('Skeleton', () => {
    const skeleton_testid = 'dt_skeleton';

    it('should render a single skeleton', () => {
        render(<Skeleton />);
        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
    });

    it('should render a paragraph consisting of 2 skeletons with a gap passed as a prop if variant === paragraph', () => {
        render(<Skeleton variant={VARIANT.PARAGRAPH} rows={2} gap={10} />);
        expect(screen.getByTestId('dt_skeleton_paragraph')).toHaveStyle('gap: 10px');
        expect(screen.getAllByTestId(skeleton_testid)).toHaveLength(2);
    });

    it('should render a non-animated skeleton', () => {
        render(<Skeleton animated={false} />);
        expect(screen.getByTestId(skeleton_testid)).not.toHaveClass('animated');
    });

    it('should render with height that is passed as a prop', () => {
        render(<Skeleton height={18} />);
        expect(screen.getByTestId(skeleton_testid)).toHaveStyle('height: 18px');
    });

    it('should render with width that is passed as a prop', () => {
        render(<Skeleton width={200} />);
        expect(screen.getByTestId(skeleton_testid)).toHaveStyle('width: 200px');
    });

    it('should render as icon if variant === icon', () => {
        render(<Skeleton variant={VARIANT.ICON} />);
        expect(screen.getByTestId(skeleton_testid)).toHaveClass('icon');
    });
});
