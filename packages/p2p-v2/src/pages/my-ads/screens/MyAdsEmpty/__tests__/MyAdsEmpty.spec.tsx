import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAdsEmpty from '../MyAdsEmpty';

describe('MyAdsEmpty', () => {
    it('should render as expected', () => {
        render(<MyAdsEmpty />);
        expect(screen.getByText('You have no ads 😞')).toBeInTheDocument();
    });
});
