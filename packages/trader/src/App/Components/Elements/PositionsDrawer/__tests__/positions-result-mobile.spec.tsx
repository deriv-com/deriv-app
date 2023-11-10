import React from 'react';
import { render, screen } from '@testing-library/react';
import PositionsResultMobile from '../positions-result-mobile';

describe('PositionsResultMobile', () => {
    it('should PositionsResultMobile be in the DOM', () => {
        render(<PositionsResultMobile is_visible={true} result='won' />);
        expect(screen.getByTestId('result_mobile')).toBeInTheDocument();
    });

    it('should PositionsResultMobile render CLOSED if result is won ', () => {
        render(<PositionsResultMobile is_visible={true} result='won' />);
        expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    it('should PositionsResultMobile render CLOSED if result is lost', () => {
        render(<PositionsResultMobile is_visible={true} result='lost' />);
        expect(screen.getByText('Closed')).toBeInTheDocument();
    });
});
