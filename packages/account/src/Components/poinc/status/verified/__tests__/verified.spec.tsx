import React from 'react';
import { screen, render } from '@testing-library/react';
import { PoincVerified } from '../verified';

describe('<PoincVerified/>', () => {
    it('should render PoincVerified component', () => {
        render(<PoincVerified />);
        expect(screen.getByText('Proof of income verification passed')).toBeInTheDocument();
    });
});
