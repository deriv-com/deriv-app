import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClosingAccount from '../closing-account';

jest.mock('../closing-account-steps', () => ({
    __esModule: true,
    default: ({ redirectToReasons }: { redirectToReasons: () => void }) => (
        <div onClick={redirectToReasons}>ClosingAccountSteps </div>
    ),
}));

jest.mock('../closing-account-reason', () => ({
    __esModule: true,
    default: ({ onBackClick }: { onBackClick: () => void }) => <div onClick={onBackClick}>ClosingAccountReason </div>,
}));

describe('<ClosingAccountReason />', () => {
    it('should render the ClosingAccountReason component', () => {
        render(<ClosingAccount />);
        expect(screen.getByTestId('dt_closing_account')).toBeInTheDocument();
    });

    it('should render the ClosingAccountSteps component if render_close_account_reason is false', () => {
        render(<ClosingAccount />);
        expect(screen.getByText('ClosingAccountSteps')).toBeInTheDocument();
    });

    it('should render the ClosingAccountReason component if render_close_account_reason is true', () => {
        const spy = jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()]);
        render(<ClosingAccount />);
        expect(screen.getByText('ClosingAccountReason')).toBeInTheDocument();
        spy.mockRestore();
    });

    it('should switch from ClosingAccountReason to ClosingAccountSteps on clicking back button in ClosingAccountReason ', () => {
        render(<ClosingAccount />);
        const closingAccountSteps = screen.getByText('ClosingAccountSteps');

        userEvent.click(closingAccountSteps);

        const backBtn = screen.getByText('ClosingAccountReason');
        userEvent.click(backBtn);

        const closingAccountStepsAfterBack = screen.getByText('ClosingAccountSteps');
        expect(closingAccountStepsAfterBack).toBeInTheDocument();
    });
});
