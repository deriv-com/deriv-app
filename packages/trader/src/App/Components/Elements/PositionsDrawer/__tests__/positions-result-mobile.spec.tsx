import React from 'react';
import { render, screen } from '@testing-library/react';
import PositionsResultMobile from '../positions-result-mobile';

describe('PositionsResultMobile', () => {
    it('should PositionsResultMobile be in the DOM', () => {
        render(<PositionsResultMobile is_visible={true} result='won' />);
        expect(screen.getByTestId('result_mobile')).toBeInTheDocument();
    });

    it('should PositionsResultMobile render LOST if result is won ', () => {
        render(<PositionsResultMobile is_visible={true} result='won' />);
        expect(screen.getByText('Won')).toBeInTheDocument();
    });

    it('should PositionsResultMobile render LOST if result is not won ', () => {
        render(<PositionsResultMobile is_visible={true} result='lost' />);
        expect(screen.getByText('Lost')).toBeInTheDocument();
    });
});
