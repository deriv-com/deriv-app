import React from 'react';
import { screen, render } from '@testing-library/react';
import { Verified } from '../verified';

describe('<Verified/>', () => {
    it('should render Verified component', () => {
        render(<Verified />);
        expect(screen.getByText('Proof of income verification passed')).toBeInTheDocument();
    });
});
