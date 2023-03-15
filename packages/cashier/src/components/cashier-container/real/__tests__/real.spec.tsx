import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Real from '../real';

jest.mock('@deriv/components', () => ({
    ...(jest.requireActual('@deriv/components') as any),
    Loading: () => <div>Loading</div>,
}));

describe('<Real />', () => {
    const props = {
        iframe_url: 'https://www.test_url.com',
        clearIframe: jest.fn(),
        iframe_height: 100,
        is_loading: false,
    };

    it('should show loader when is_loading is true or iframe_height is equal to 0', () => {
        const { rerender } = render(<Real {...props} iframe_height={0} />);

        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(<Real {...props} is_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render an iframe if iframe_url is not an empty string', () => {
        render(<Real {...props} />);

        expect(screen.queryByTestId('dt_doughflow_section')).toBeInTheDocument();
    });

    describe('Breadcrumb visibility', () => {
        it('should show breadcrumbs only on deposit page and only for non EU clients', () => {
            render(<Real {...props} is_deposit is_eu={false} />);

            expect(screen.getByText(/cashier/i)).toBeInTheDocument();
            expect(screen.getByText(/deposit via bank wire, credit card, and e-wallet/i)).toBeInTheDocument();
        });

        it('should not show breadcrumbs on deposit page if iframe_height is equal to 0', () => {
            render(<Real {...props} is_deposit is_eu={false} iframe_height={0} />);

            expect(screen.queryByText(/cashier/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/deposit via bank wire, credit card, and e-wallet/i)).not.toBeInTheDocument();
        });

        it('should not show breadcrumbs on withdraw page', () => {
            render(<Real {...props} is_deposit={false} />);

            expect(screen.queryByText(/cashier/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/deposit via bank wire, credit card, and e-wallet/i)).not.toBeInTheDocument();
        });
    });

    it('should trigger setIsDeposit callback when the user clicks on Cashier breadcrumb', () => {
        const setIsDeposit = jest.fn();
        render(<Real {...props} is_deposit is_eu={false} setIsDeposit={setIsDeposit} />);

        const el_breadcrumb_cashier = screen.queryByText(/cashier/i);

        if (el_breadcrumb_cashier) {
            userEvent.click(el_breadcrumb_cashier);
            expect(setIsDeposit).toHaveBeenCalledWith(false);
        }
    });

    it('should trigger clearIframe and onMountDeposit callbacks when <Real /> component is destroyed on deposit page', () => {
        const onMountDeposit = jest.fn();
        const { unmount } = render(<Real {...props} is_deposit is_eu={false} onMountDeposit={onMountDeposit} />);

        unmount();

        expect(props.clearIframe).toHaveBeenCalled();
        expect(onMountDeposit).toHaveBeenCalled();
    });
});
