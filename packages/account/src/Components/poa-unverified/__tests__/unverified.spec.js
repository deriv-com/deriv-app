import React from 'react';
import { screen, render } from '@testing-library/react';
import { Unverified } from '../unverified';

describe('<Unverified />', () => {
    it('should render the Unverified component', () => {
        render(<Unverified />);
        expect(screen.getByText('We could not verify your proof of address')).toBeInTheDocument();
        expect(screen.getByText('Please check your email for details.')).toBeInTheDocument();
    });
});
