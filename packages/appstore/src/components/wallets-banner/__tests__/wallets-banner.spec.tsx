import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { isMobile } from '@deriv/shared';
import WalletsBannerUpgrade from '../wallets-banner-upgrade';
import { TImageTestID } from 'Assets/svgs/wallets/image-types';
import WalletsBannerUpgrading from '../wallets-banner-upgrading';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('<WalletsBanner />', () => {
    describe('<WalletsBannerUpgrade />', () => {
        const desktop: TImageTestID = 'dt_upgrade_desktop';
        const mobile: TImageTestID = 'dt_upgrade_mobile';

        it('Should render properly with right banner if status is eligible', () => {
            render(<WalletsBannerUpgrade />);
            const btn = screen.queryByText('Upgrade now');

            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop', () => {
            isMobile.mockReturnValue(false);
            render(<WalletsBannerUpgrade />);
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile', () => {
            isMobile.mockReturnValue(true);
            render(<WalletsBannerUpgrade />);
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });

    // describe('<WalletsBannerUpgrading />', () => {
    //     const desktop: TImageTestID = 'dt_ready_desktop';
    //     const mobile: TImageTestID = 'dt_ready_mobile';

    //     it('Should render properly with right banner if status is eligible', () => {
    //         render(<WalletsBannerUpgrading />);
    //         const btn = screen.queryByText('Upgrade now');

    //         expect(btn).toBeInTheDocument();
    //     });

    //     it('Should render image properly for desktop', () => {
    //         isMobile.mockReturnValue(false);
    //         render(<WalletsBannerUpgrading />);
    //         const desktop_image = screen.queryByTestId(desktop);
    //         const mobile_image = screen.queryByTestId(mobile);

    //         expect(desktop_image).toBeInTheDocument();
    //         expect(mobile_image).not.toBeInTheDocument();
    //     });

    //     it('Should render image properly for mobile', () => {
    //         isMobile.mockReturnValue(true);
    //         render(<WalletsBannerUpgrading />);
    //         const desktop_image = screen.queryByTestId(desktop);
    //         const mobile_image = screen.queryByTestId(mobile);

    //         expect(mobile_image).toBeInTheDocument();
    //         expect(desktop_image).not.toBeInTheDocument();
    //     });
    // });
});
