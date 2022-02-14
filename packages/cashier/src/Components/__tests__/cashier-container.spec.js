import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierContainer from '../cashier-container';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

describe('<CashierContainer/>', () => {
    const props = {
        iframe_url:
            'https://doughflow-test.4x.my/cashier/login.asp?Sportsbook=test&PIN=CR90000010&Lang=en&Password=20192eef9f1c8258354030632a913916fe331c8f&Secret=11eb12e081e93780306d7c8a7483748a&Action=DEPOSIT&udef1=EN&udef2=deriv&theme=light',
        clearIframe: jest.fn(),
    };

    it('should render the component with iframe when iframe_url value is passed', () => {
        const { queryByTestId } = render(<CashierContainer {...props} />);
        const el_loader = screen.queryByText('Loading');

        expect(el_loader).not.toBeInTheDocument();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
    });

    it('should render the loading when is_loading is true', () => {
        const { queryByTestId } = render(<CashierContainer {...props} iframe_url='' is_loading />);
        const el_loader = screen.queryByText('Loading');

        expect(el_loader).toBeInTheDocument();
        expect(queryByTestId('doughflow_section')).toBeNull();
    });

    it('will display doughflow and loader if all props are provided', () => {
        const { queryByTestId } = render(<CashierContainer {...props} is_loading />);
        const el_loader = screen.queryByText('Loading');

        expect(el_loader).toBeInTheDocument();
        expect(queryByTestId('doughflow_section')).toBeTruthy();
    });
});
