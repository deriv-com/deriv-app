import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAdsEmpty from '../MyAdsEmpty';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

describe('MyAdsEmpty', () => {
    it('should render as expected', () => {
        render(<MyAdsEmpty />);
        expect(screen.getByText('You have no ads 😞')).toBeInTheDocument();
    });
});
