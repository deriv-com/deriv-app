import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgent from '../PaymentAgentWithdrawalContainer';

jest.mock('../../../../../lib', () => ({
    ...jest.requireActual('../../../../../lib'),
    PaymentAgentWithdrawalModule: jest.fn(() => <div>PaymentAgentWithdrawalModule</div>),
    WithdrawalVerificationModule: jest.fn(() => <div>WithdrawalVerificationModule</div>),
}));

describe('<PaymentAgentWithdrawalContainer />', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?verification=1234'),
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
    });

    it('should remove the `verification` param from the window url', () => {
        const replaceStateSpy = jest.spyOn(window.history, 'replaceState');

        render(<PaymentAgent />);

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });

    it('should render withdrawal email verification page if no verification code found', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect'),
            writable: true,
        });

        render(<PaymentAgent />);
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('should render payment agent withdrawal module', () => {
        render(<PaymentAgent />);
        expect(screen.getByText('PaymentAgentWithdrawalModule')).toBeInTheDocument();
    });
});
