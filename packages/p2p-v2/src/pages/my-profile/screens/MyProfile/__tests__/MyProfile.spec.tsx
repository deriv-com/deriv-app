import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfile from '../MyProfile';

jest.mock('@/components/Verification', () => ({
    Verification: jest.fn(() => <div>Verification</div>),
}));
jest.mock('@/components/Modals/NicknameModal', () => ({
    NicknameModal: jest.fn(({ isModalOpen }) => {
        if (isModalOpen) return <div>NicknameModal</div>;
        return <></>;
    }),
}));
jest.mock('../../MyProfileContent', () => ({
    MyProfileContent: jest.fn(() => <div>MyProfileContent</div>),
}));
jest.mock('../../MyProfileStats', () => ({
    MyProfileStats: jest.fn(() => <div>MyProfileStatsScreen</div>),
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
jest.mock('../MyProfileMobile', () => ({
    __esModule: true,
    default: jest.fn(() => <div>MyProfileMobile</div>),
}));

function resetMockedData() {
    mockQueryString = new Map(
        Object.entries({
            tab: 'default',
        })
    );
    mockUsePoiPoaStatus = {
        data: {
            isP2PPoaRequired: false,
            isPoaVerified: true,
            isPoiVerified: true,
        },
        isLoading: false,
    };
    mockUseAdvertiserStats = {
        data: {
            fullName: 'Jane Doe',
        },
        failureReason: undefined,
        isLoading: false,
    };
}

let mockQueryString = new Map();
let mockUsePoiPoaStatus = {
    data: {
        isP2PPoaRequired: false,
        isPoaVerified: true,
        isPoiVerified: true,
    },
    isLoading: false,
};
let mockUseAdvertiserStats = {
    data: {},
    failureReason: undefined,
    isLoading: false,
};
const mockUseDevice = {
    isMobile: false,
};

jest.mock('@/hooks', () => ({
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
    useDevice: jest.fn(() => mockUseDevice),
    usePoiPoaStatus: jest.fn(() => mockUsePoiPoaStatus),
    useQueryString: jest.fn(() => ({
        queryString: mockQueryString,
        setQueryString: jest.fn(),
    })),
}));

describe('MyProfile', () => {
    afterEach(() => {
        resetMockedData();
    });
    it('should render the loader component when data is not ready', () => {
        // @ts-expect-error Clear data to assert loading state
        mockUseAdvertiserStats.data = undefined;
        mockUseAdvertiserStats.isLoading = true;
        render(<MyProfile />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
    it('should render the verification component if user has not completed POI ', () => {
        mockUsePoiPoaStatus.data.isPoaVerified = true;
        mockUsePoiPoaStatus.data.isPoiVerified = false;

        render(<MyProfile />);
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
    it('should render the verification component if user has not completed  POA', () => {
        mockUsePoiPoaStatus.data.isPoaVerified = false;
        mockUsePoiPoaStatus.data.isPoiVerified = true;

        render(<MyProfile />);
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
    it('should show the nickname modal if user has completed POI or POA for the first time', () => {
        mockUsePoiPoaStatus.data.isPoaVerified = true;
        mockUsePoiPoaStatus.data.isPoiVerified = true;
        // @ts-expect-error Add failureReason to assert nickname modal visible case
        mockUseAdvertiserStats.failureReason = 'Failure';

        render(<MyProfile />);
        expect(screen.getByText('NicknameModal')).toBeInTheDocument();
    });
    it('should render the tabs and correct screens', () => {
        render(<MyProfile />);
        expect(screen.getByText('MyProfileStatsScreen')).toBeInTheDocument();

        const paymentMethodsBtn = screen.getByRole('button', {
            name: 'Payment methods',
        });
        userEvent.click(paymentMethodsBtn);
        expect(screen.getByText('PaymentMethodsScreen')).toBeInTheDocument();
    });
    it('should render the mobile view', () => {
        mockUseDevice.isMobile = true;

        render(<MyProfile />);
        expect(screen.getByText('MyProfileMobile')).toBeInTheDocument();
    });
});
