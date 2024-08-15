import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render } from '@testing-library/react';
import AccountLimitsOverlay from '../account-limits-overlay';
import AccountLimitsContext from '../account-limits-context';

describe('<AccountLimitsOverlay/>', () => {
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    const Component = () => (
        <AccountLimitsContext.Provider
            value={{
                currency: '',
                overlay_ref: document.createElement('div'),
                toggleOverlay: jest.fn(),
            }}
        >
            <AccountLimitsOverlay />
        </AccountLimitsContext.Provider>
    );

    it('should render AccountLimitsOverlay component', () => {
        render(<Component />);
        expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
        expect(screen.getByText(/these are default limits that we apply to your accounts\./i)).toBeInTheDocument();
    });

    it('should go to help-centre page if the Help Centre link on the text is clicked', () => {
        render(<Component />);

        expect(screen.getByText(/Help Centre/).hasAttribute('href'));
    });
    it('should show Done Button', () => {
        render(<Component />);

        const done_btn = screen.getByRole('button', {
            name: /done/i,
        });
        expect(done_btn).toBeInTheDocument();
    });
});
