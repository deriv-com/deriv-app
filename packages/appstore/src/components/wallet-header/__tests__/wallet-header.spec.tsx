import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// import { isMobile } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletHeader from '..';

const mocked_root_store = mockStore({
    ui: {
        is_dark_mode_on: false,
    },
});

// const mocked_root_store: DeepPartial<ReturnType<typeof useStore>> = {
//     ui: {
//         is_dark_mode_on: false,
//     },
// };

// jest.mock('@deriv/stores', () => ({
//     __esModule: true,
//     default: 'mockedDefaultExport',
//     observer: <T,>(Component: T) => Component,
//     // useStore: () => mocked_root_store,
// }));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
}));

// jest.mock('@deriv/components', () => {
//     const original_module = jest.requireActual('@deriv/components');
//     return {
//         ...original_module,
//         // Icon: jest.fn(() => <div>IcCross</div>),
//     };
// });

// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     // isMobile: jest.fn(() => false),
// }));

describe('<WalletHeader />', () => {
    describe('Demo wallet', () => {
        it('Should render right currency card', () => {
            const account_type = 'demo';
            const currency = 'USD';
            const dt_currency = account_type === 'demo' ? 'demo' : currency.toLowerCase();
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletHeader account_type={account_type} />
                </StoreProvider>
            );
            const currency_card = screen.queryByTestId(`dt_${dt_currency}`);

            expect(currency_card).toBeInTheDocument();
        });

        // it('Should render image properly for desktop', () => {
        //     isMobile.mockReturnValue(false);
        //     render(<WalletsBannerUpgrade />);
        //     const desktop_image = screen.queryByTestId(desktop);
        //     const mobile_image = screen.queryByTestId(mobile);

        //     expect(desktop_image).toBeInTheDocument();
        //     expect(mobile_image).not.toBeInTheDocument();
        // });

        // it('Should render image properly for mobile', () => {
        //     isMobile.mockReturnValue(true);
        //     render(<WalletsBannerUpgrade />);
        //     const desktop_image = screen.queryByTestId(desktop);
        //     const mobile_image = screen.queryByTestId(mobile);

        //     expect(mobile_image).toBeInTheDocument();
        //     expect(desktop_image).not.toBeInTheDocument();
        // });
    });
});
