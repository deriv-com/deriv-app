import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileMobile from '../MyProfileMobile';

jest.mock('@/components/ProfileContent', () => ({
    ProfileContent: jest.fn(() => <div>ProfileContent</div>),
}));
jest.mock('../../MyProfileStats/MyProfileStatsMobile', () => ({
    __esModule: true,
    default: jest.fn(() => <div>MyProfileStatsMobile</div>),
}));
jest.mock('../../MyProfileAdDetails', () => ({
    MyProfileAdDetails: jest.fn(() => <div>MyProfileAdDetailsScreen</div>),
}));
jest.mock('../../MyProfileCounterparties', () => ({
    MyProfileCounterparties: jest.fn(() => <div>MyProfileCounterpartiesScreen</div>),
}));
jest.mock('../../PaymentMethods', () => ({
    PaymentMethods: jest.fn(() => <div>PaymentMethodsScreen</div>),
}));

function resetMockedData() {
    mockQueryString = {
        tab: 'default',
    };
}

let mockQueryString = {
    tab: 'default',
};

const mockSetQueryString = jest.fn();
jest.mock('@/hooks', () => ({
    useQueryString: jest.fn(() => ({
        queryString: mockQueryString,
        setQueryString: mockSetQueryString,
    })),
}));

describe('MyProfileMobile', () => {
    afterEach(() => {
        resetMockedData();
    });
    it('should render the default tab', () => {
        render(<MyProfileMobile />);
        expect(screen.getByText('ProfileContent')).toBeInTheDocument();
    });
    it('should render the appropriate screens', () => {
        render(<MyProfileMobile />);

        const clickTabAndRender = (tab: string) => {
            const btn = screen.getByRole('button', {
                name: tab,
            });
            userEvent.click(btn);
            expect(mockSetQueryString).toBeCalledWith({
                tab,
            });
            mockQueryString = {
                tab,
            };
            render(<MyProfileMobile />);
        };

        clickTabAndRender('Stats');
        expect(screen.getByText('MyProfileStatsMobile')).toBeInTheDocument();

        clickTabAndRender('Payment methods');
        expect(screen.getByText('PaymentMethodsScreen')).toBeInTheDocument();

        clickTabAndRender('Ad details');
        expect(screen.getByText('MyProfileAdDetailsScreen')).toBeInTheDocument();

        clickTabAndRender('My counterparties');
        expect(screen.getByText('MyProfileCounterpartiesScreen')).toBeInTheDocument();
    });
});
