import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import AccountLimitsContext from '../account-limits-context';
import AccountLimitsFooterPortal from '../account-limits-footer';

const AccountLimitsFooterPortalComponent = () => (
    <AccountLimitsContext.Provider
        value={{
            footer_ref: <div data-testid='mocked_footer_ref'></div>,
            toggleOverlay: jest.fn(),
        }}
    >
        <AccountLimitsFooterPortal />
    </AccountLimitsContext.Provider>
);

describe('<AccountLimitsFooterPortal/>', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    it('should render AccountLimitsFooterPortal component', () => {
        render(<AccountLimitsFooterPortalComponent />);
        expect(screen.getByText(/learn more about account limits/i)).toBeInTheDocument();
    });
    it('should render anchor tag', () => {
        render(<AccountLimitsFooterPortalComponent />);
        expect(screen.getAllByTestId('footer_text').length).toBe(1);
    });
});
