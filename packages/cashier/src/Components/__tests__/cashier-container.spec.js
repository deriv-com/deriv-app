import React from 'react';
import { routes } from '@deriv/shared';
import { fireEvent, render } from '@testing-library/react';
import CashierContainer from '../cashier-container';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('<CashierContainer/>', () => {
    const URL = `https://doughflow-test.4x.my/cashier/login.asp?Sportsbook=test&PIN=CR90000010&Lang=en&Password=20192eef9f1c8258354030632a913916fe331c8f&Secret=11eb12e081e93780306d7c8a7483748a&Action=DEPOSIT&udef1=EN&udef2=deriv&theme=light`;
    let clearIFrame = null;

    beforeAll(() => {
        clearIFrame = jest.fn();
    });

    it('should render the component with iframe when iframe_url is true', () => {
        const { queryByTestId, container } = render(<CashierContainer iframe_url={URL} clearIframe={clearIFrame} />);
        const el_loader = container.querySelector('.barspinner');
        expect(el_loader).toBeNull();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
        expect(queryByTestId('cashier_section')).toBeNull();
    });

    it('should render the crypto section when is_crypto is true', () => {
        const { queryByTestId, container } = render(<CashierContainer is_crypto clearIframe={clearIFrame} />);
        const el_loader = container.querySelector('.barspinner');
        expect(el_loader).toBeNull();
        expect(queryByTestId('cashier_section')).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeNull();
    });

    it('should render the loading when is_loading is true', () => {
        const { queryByTestId, container } = render(<CashierContainer clearIframe={clearIFrame} is_loading />);
        const el_loader = container.querySelector('.barspinner');
        expect(el_loader).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeNull();
        expect(queryByTestId('cashier_section')).toBeNull();
    });

    it('will display doughflow and crypto if all props are provided', () => {
        const { queryByTestId, container } = render(
            <CashierContainer is_crypto iframe_url={URL} clearIframe={clearIFrame} is_loading />
        );
        const el_loader = container.querySelector('.barspinner');
        expect(el_loader).toBeTruthy();
        expect(queryByTestId('cashier_section')).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
    });

    it('should navigate to Fiat onramp page when `Try our Fiat onramp` button is clicked', () => {
        const { getByRole } = render(<CashierContainer is_crypto clearIframe={clearIFrame} />);
        fireEvent.click(getByRole('button'));
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.cashier_onramp);
    });
});
