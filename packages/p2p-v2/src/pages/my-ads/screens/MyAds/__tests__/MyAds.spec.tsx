import React from 'react';
import { useQueryString } from '@/hooks';
import { render, screen } from '@testing-library/react';
import MyAds from '../MyAds';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useQueryString: jest.fn().mockReturnValue({
        queryString: {},
    }),
}));

const mockUseQueryString = useQueryString as jest.Mock;

jest.mock('../MyAdsTable', () => ({
    MyAdsTable: () => <div>MyAdsTable</div>,
}));

jest.mock('../../CreateEditAd', () => ({
    CreateEditAd: () => <div>CreateEditAd</div>,
}));

describe('MyAds', () => {
    it('should render the component as expected', () => {
        render(<MyAds />);
        expect(screen.getByText('MyAdsTable')).toBeInTheDocument();
    });
    it('should render the create/edit ad form when formAction is present in query string', () => {
        mockUseQueryString.mockReturnValue({
            queryString: {
                formAction: 'create',
            },
        });
        render(<MyAds />);
        expect(screen.queryByText('MyAdsTable')).not.toBeInTheDocument();
        expect(screen.getByText('CreateEditAd')).toBeInTheDocument();
    });
});
