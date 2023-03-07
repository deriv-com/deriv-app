import React from 'react';
import { screen, render } from '@testing-library/react';
import { PoincNotRequired } from '../not-required';

describe('<PoincNotRequired/>', () => {
    it('should render PoincNotRequired component', () => {
        render(<PoincNotRequired />);
        expect(screen.getByText('Proof of income verification is not required')).toBeInTheDocument();
    });
});
