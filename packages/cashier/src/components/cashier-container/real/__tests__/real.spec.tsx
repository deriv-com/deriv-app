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

        expect(screen.queryByText('Loading')).toBeInTheDocument();

        rerender(<Real {...props} is_loading />);

        expect(screen.queryByText('Loading')).toBeInTheDocument();
    });

    it('should render an iframe if iframe_url is not an empty string', () => {
        render(<Real {...props} />);

        expect(screen.queryByTestId('dt_doughflow_section')).toBeInTheDocument();
    });

    describe('should show or not show arrow back', () => {
        it('should show arrow back only on deposit page and only for non EU clients', () => {
            render(<Real {...props} is_deposit is_eu={false} />);

            expect(screen.queryByTestId('dt_arrow_back')).toBeInTheDocument();
        });

        it('should not show arrow back on deposit page if iframe_height is equal to 0', () => {
            render(<Real {...props} is_deposit is_eu={false} iframe_height={0} />);

            expect(screen.queryByTestId('dt_arrow_back')).not.toBeInTheDocument();
        });

        it('should not show arrow back on withdraw page', () => {
            render(<Real {...props} is_deposit={false} />);

            expect(screen.queryByTestId('dt_arrow_back')).not.toBeInTheDocument();
        });
    });

    it('should trigger setIsDeposit callback when the user clicks on arrow back', () => {
        const setIsDeposit = jest.fn();
        render(<Real {...props} is_deposit is_eu={false} setIsDeposit={setIsDeposit} />);

        const el_arrow_back = screen.queryByTestId('dt_arrow_back');

        if (el_arrow_back) {
            userEvent.click(el_arrow_back);
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
