import React from 'react';
import { render } from '@testing-library/react';
import CashierContainer from '../cashier-container';

describe('<CashierContainer/>', () => {
    const url = `https://doughflow-test.4x.my/cashier/login.asp?Sportsbook=test&PIN=CR90000010&Lang=en&Password=20192eef9f1c8258354030632a913916fe331c8f&Secret=11eb12e081e93780306d7c8a7483748a&Action=DEPOSIT&udef1=EN&udef2=deriv&theme=light`;
    let clearIFrame = null;

    beforeAll(() => {
        clearIFrame = jest.fn();
    });

    it('should render the component with iframe when iframe_url is true', () => {
        const { queryByTestId, container } = render(<CashierContainer iframe_url={url} clearIframe={clearIFrame} />);
        const el_loader = container.querySelector('.barspinner');

        expect(el_loader).toBeNull();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
    });

    it('should render the loading when is_loading is true', () => {
        const { queryByTestId, container } = render(<CashierContainer clearIframe={clearIFrame} is_loading />);
        const el_loader = container.querySelector('.barspinner');

        expect(el_loader).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeNull();
    });

    it('will display doughflow and loader if all props are provided', () => {
        const { queryByTestId, container } = render(
            <CashierContainer is_crypto iframe_url={url} clearIframe={clearIFrame} is_loading />
        );
        const el_loader = container.querySelector('.barspinner');

        expect(el_loader).toBeTruthy();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
    });
});
