import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import AccountLimitsContext from '../account-limits-context';
import AccountLimitsFooterPortal from '../account-limits-footer';

const AccountLimitsFooterPortalComponent = ({ onClick }: any) => {
    const footer = React.useRef<HTMLDivElement>(null);
    return (
        <React.Fragment>
            <AccountLimitsContext.Provider
                value={{
                    currency: 'USD',
                    footer_ref: footer,
                    toggleOverlay: onClick,
                }}
            >
                <AccountLimitsFooterPortal />
            </AccountLimitsContext.Provider>
        </React.Fragment>
    );
};

describe('<AccountLimitsFooterPortal/>', () => {
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    it('should render AccountLimitsFooterPortal component', () => {
        render(<AccountLimitsFooterPortalComponent />);
        expect(screen.getByText(/learn more about account limits/i)).toBeInTheDocument();
    });
    it('should render anchor tag', () => {
        render(<AccountLimitsFooterPortalComponent />);
        expect(screen.getAllByTestId('dt_footer_text').length).toBe(1);
    });
    it('should trigger toggleOverlay', async () => {
        const toggleOverlay = jest.fn();
        render(<AccountLimitsFooterPortalComponent onClick={toggleOverlay} />);
        const footer_text = await screen.findByText(/learn more about account limits/i);
        fireEvent.click(footer_text);
        expect(toggleOverlay).toHaveBeenCalled();
    });
});
