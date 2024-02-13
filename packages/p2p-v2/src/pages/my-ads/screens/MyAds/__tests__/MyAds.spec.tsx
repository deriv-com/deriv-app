import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAds from '../MyAds';

jest.mock('../MyAdsTable', () => ({
    MyAdsTable: () => <div>MyAdsTable</div>,
}));

describe('MyAds', () => {
    it('should render the component as expected', () => {
        render(<MyAds />);
        expect(screen.getByText('MyAdsTable')).toBeInTheDocument();
    });
});
