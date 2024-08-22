import React from 'react';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import WalletBadge from '../WalletBadge';

jest.mock('../../../hooks/useDevice');
const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

describe('WalletBadge Component', () => {
    beforeEach(() => {
        mockedUseDevice.mockReturnValue({ isDesktop: true, isMobile: false, isTablet: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<WalletBadge>Test Child</WalletBadge>);
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it(`should render correctly when isMobile is true`, () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        render(<WalletBadge>Test Child</WalletBadge>);
        const badge = screen.getByText('Test Child');
        expect(badge).toHaveClass('derivs-text__size--sm');
    });
});
