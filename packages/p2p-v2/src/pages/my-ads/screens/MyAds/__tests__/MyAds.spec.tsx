import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAds from '../MyAds';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('../MyAdsTable', () => ({
    MyAdsTable: () => <div>MyAdsTable</div>,
}));

describe('MyAds', () => {
    it('should render the MyAdsTable component', () => {
        render(<MyAds />);
        expect(screen.getByText('MyAdsTable')).toBeInTheDocument();
    });
});
