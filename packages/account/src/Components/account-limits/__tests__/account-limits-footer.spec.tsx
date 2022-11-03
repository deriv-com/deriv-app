import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import AccountLimitsContext from '../account-limits-context';
import AccountLimitsFooterPortal from '../account-limits-footer';

const AccountLimitsFooterPortalComponent = () => {
    const footer = React.useRef<HTMLDivElement>(null);
    return (
        <React.Fragment>
            <div ref={footer} data-testid='mocked_footer_ref' />
            <AccountLimitsContext.Provider
                value={{
                    currency: 'USD',
                    footer_ref: footer,
                    toggleOverlay: jest.fn(),
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
        expect(screen.getAllByTestId('footer_text').length).toBe(1);
    });

    it('should render AppSettings.Footer components correctly', () => {
        render(<AccountLimitsFooterPortalComponent />);
        expect(screen.queryByTestId('dt_app_settings_footer')).toHaveTextContent('Learn more about account limits');
    });
});
