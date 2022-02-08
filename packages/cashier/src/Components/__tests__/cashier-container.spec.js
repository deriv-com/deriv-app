import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CashierContainer from '../cashier-container';

import { routes } from '@deriv/shared';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('<CashierContainer/>', () => {
    let clearIframe;

    beforeAll(() => {
        clearIframe = jest.fn();
    });

    it('should render the component with iframe when iframe_url is true', async () => {
        const url = `https://doughflow-test.4x.my/cashier/login.asp?Sportsbook=test&PIN=CR90000010&Lang=en&Password=20192eef9f1c8258354030632a913916fe331c8f&Secret=11eb12e081e93780306d7c8a7483748a&Action=DEPOSIT&udef1=EN&udef2=deriv&theme=light`;
        const { queryByTestId, container } = render(<CashierContainer iframe_url={url} clearIframe={clearIframe} />);
        const loaderEle = container.querySelector('.barspinner');
        expect(loaderEle).toBeNull();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
        expect(queryByTestId('cashier_section')).toBeNull();
    });

    it('should render the crypto section when is_crypto is true', async () => {
        const isCrypto = true;
        const { queryByTestId, container } = render(
            <CashierContainer is_crypto={isCrypto} clearIframe={clearIframe} />
        );
        const loaderEle = container.querySelector('.barspinner');
        expect(loaderEle).toBeNull();
        expect(queryByTestId('cashier_section')).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeNull();
    });

    it('should render the loading when is_loading is true', async () => {
        const isLoading = true;
        const { queryByTestId, container } = render(
            <CashierContainer clearIframe={clearIframe} is_loading={isLoading} />
        );
        const loaderEle = container.querySelector('.barspinner');
        expect(loaderEle).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeNull();
        expect(queryByTestId('cashier_section')).toBeNull();
    });

    it('will display doughflow and crypto if all props are provided', async () => {
        const isCrypto = true;
        const isLoading = true;
        const url = `https://doughflow-test.4x.my/cashier/login.asp?Sportsbook=test&PIN=CR90000010&Lang=en&Password=20192eef9f1c8258354030632a913916fe331c8f&Secret=11eb12e081e93780306d7c8a7483748a&Action=DEPOSIT&udef1=EN&udef2=deriv&theme=light`;
        const { queryByTestId, container } = render(
            <CashierContainer is_crypto={isCrypto} iframe_url={url} clearIframe={clearIframe} is_loading={isLoading} />
        );
        const loaderEle = container.querySelector('.barspinner');
        expect(loaderEle).toBeTruthy();
        expect(queryByTestId('cashier_section')).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
    });

    it('should navigate to Fiat onramp page when `Try our Fiat onramp` button is clicked', async () => {
        const isCrypto = true;
        const { getByRole } = render(<CashierContainer is_crypto={isCrypto} clearIframe={clearIframe} />);
        fireEvent.click(getByRole('button'));
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.cashier_onramp);
    });
});
