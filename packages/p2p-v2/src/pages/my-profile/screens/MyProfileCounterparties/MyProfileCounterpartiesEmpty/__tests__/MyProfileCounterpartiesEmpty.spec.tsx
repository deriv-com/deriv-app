import React from 'react';
import MyProfileCounterpartiesEmpty from '../MyProfileCounterpartiesEmpty';
import { render, screen } from '@testing-library/react';

describe('MyProfileCounterpartiesEmpty', () => {
    it('should render the component as expected', () => {
        render(<MyProfileCounterpartiesEmpty />);
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
});
