import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfile from '../MyProfile';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    ProfileContent: jest.fn(() => <div>ProfileContentScreen</div>),
    Verification: jest.fn(() => <div>Verification</div>),
}));

jest.mock('@/components/Modals/NicknameModal', () => ({
    NicknameModal: jest.fn(({ isModalOpen }) => {
        if (isModalOpen) return <div>NicknameModal</div>;
        return <></>;
    }),
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
            totalOrders: 0,
            tradePartners: 0,
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
    usePoiPoaStatus: jest.fn(() => mockUsePoiPoaStatus),
    useQueryString: jest.fn(() => ({
        queryString: mockQueryString,
        setQueryString: jest.fn(),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => mockUseDevice),
}));

describe('MyProfile', () => {
    afterEach(() => {
        resetMockedData();
    });
    it('should render the loader component when data is not ready', () => {
        // @ts-expect-error Clear data to assert loading state
        mockUseAdvertiserStats.data = undefined;
        mockUseAdvertiserStats.isLoading = true;
        render(<MyProfile />, { wrapper });
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
    it('should render the verification component if user has not completed POI ', () => {
        mockUsePoiPoaStatus.data.isPoaVerified = true;
        mockUsePoiPoaStatus.data.isPoiVerified = false;

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
    it('should render the verification component if user has not completed  POA', () => {
        mockUsePoiPoaStatus.data.isPoaVerified = false;
        mockUsePoiPoaStatus.data.isPoiVerified = true;

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
    it('should show the nickname modal if user has completed POI or POA for the first time', () => {
        mockUsePoiPoaStatus.data.isPoaVerified = true;
        mockUsePoiPoaStatus.data.isPoiVerified = true;
        // @ts-expect-error Add failureReason to assert nickname modal visible case
        mockUseAdvertiserStats.failureReason = 'Failure';

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('NicknameModal')).toBeInTheDocument();
    });
    it('should render the tabs and correct screens', () => {
        render(<MyProfile />, { wrapper });
        expect(screen.getByText('MyProfileStatsScreen')).toBeInTheDocument();

        const paymentMethodsBtn = screen.getByRole('button', {
            name: 'Payment methods',
        });
        userEvent.click(paymentMethodsBtn);
        expect(screen.getByText('PaymentMethodsScreen')).toBeInTheDocument();
    });
    it('should render the mobile view', () => {
        mockUseDevice.isMobile = true;

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('MyProfileMobile')).toBeInTheDocument();
    });
});
