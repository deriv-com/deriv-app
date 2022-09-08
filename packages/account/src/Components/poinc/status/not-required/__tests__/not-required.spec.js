import React from 'react';
import { screen, render } from '@testing-library/react';
import { PoincNotRequired } from '../not-required';

describe('<PoincNotRequired/>', () => {
    it('should render PoincNotRequired component', () => {
        render(<PoincNotRequired />);
        expect(screen.getByText('Proof of income verification not required')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your account does not need income verification at this time. We will inform you if income verification is required in the future.'
            )
        ).toBeInTheDocument();
    });
});
