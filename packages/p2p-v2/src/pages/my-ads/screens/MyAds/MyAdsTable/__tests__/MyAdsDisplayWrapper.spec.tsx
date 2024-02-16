import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import MyAdsDisplayWrapper from '../MyAdsDisplayWrapper';

const mockProps = {
    isPaused: false,
    onClickToggle: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('MyAdsDisplayWrapper', () => {
    it('should render the component as expected', () => {
        render(
            <MyAdsDisplayWrapper {...mockProps}>
                <div>children</div>
            </MyAdsDisplayWrapper>
        );
        expect(screen.queryByTestId('dt_p2p_v2_full_page_mobile_wrapper')).not.toBeInTheDocument();
    });
    it('should render the content inside full page mobile wrapper in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(
            <MyAdsDisplayWrapper {...mockProps}>
                <div>children</div>
            </MyAdsDisplayWrapper>
        );
        expect(screen.queryByTestId('dt_p2p_v2_full_page_mobile_wrapper')).toBeInTheDocument();
    });
});
