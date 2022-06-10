import React from 'react';
import { screen, render } from '@testing-library/react';
import { NotRequired } from '../not-required';

describe('<NotRequired/>', () => {
    it('should render NotRequired component', () => {
        render(<NotRequired />);
        expect(screen.getByText('Proof of income verification not required')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your account does not need income verification at this time. We will inform you if income verification is required in the future.'
            )
        ).toBeInTheDocument();
    });
});
