import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import PaymentAgentWithdrawal from '../PaymentAgentWithdrawal';
import { usePaymentAgentContext } from '../../provider';
import { usePaymentAgentWithdrawalContext } from '../provider';

const mockedUsePaymentAgentContext = usePaymentAgentContext as jest.MockedFunction<typeof usePaymentAgentContext>;
const mockedUsePaymentAgentWithdrawalContext = usePaymentAgentWithdrawalContext as jest.MockedFunction<
    typeof usePaymentAgentWithdrawalContext
>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loader</div>),
}));
jest.mock('../../provider', () => ({
    PaymentAgentProvider: jest.fn(({ children }) => <div>{children}</div>),
    usePaymentAgentContext: jest.fn(() => ({ isPaymentAgentListLoading: false })),
}));

let mockedSetIsUnlistedWithdrawal: jest.MockedFunction<typeof jest.fn>;

jest.mock('../provider', () => ({
    PaymentAgentWithdrawalProvider: jest.fn(({ children }) => <div>{children}</div>),
    usePaymentAgentWithdrawalContext: jest.fn(() => ({
        isTryWithdrawalSuccessful: false,
        isUnlistedWithdrawal: false,
        isWithdrawalSuccessful: false,
        setIsUnlistedWithdrawal: mockedSetIsUnlistedWithdrawal,
    })),
}));

jest.mock('../../components', () => ({
    PaymentAgentList: jest.fn(() => <div>PaymentAgentList</div>),
    PaymentAgentSearchContainer: jest.fn(() => <div>PaymentAgentSearchContainer</div>),
}));

jest.mock('../components', () => ({
    PaymentAgentUnlistedWithdrawalForm: jest.fn(() => <div>PaymentAgentUnlistedWithdrawalForm</div>),
    PaymentAgentWithdrawalConfirm: jest.fn(() => <div>PaymentAgentWithdrawalConfirm</div>),
    PaymentAgentWithdrawalReceipt: jest.fn(() => <div>PaymentAgentWithdrawalReceipt</div>),
}));

describe('PaymentAgentWithdrawal', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentWithdrawal>;

    beforeEach(() => {
        mockedProps = {
            setVerificationCode: jest.fn(),
            verificationCode: 'code',
        };
        mockedSetIsUnlistedWithdrawal = jest.fn();
    });

    it('should render proper title and PaymentAgentSearchContainer by default', () => {
        render(<PaymentAgentWithdrawal {...mockedProps} />);

        expect(
            screen.getByText(
                /Choose your preferred payment agent and enter your withdrawal amount. If your payment agent is not listed,/
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/search for them using their account number/)).toBeInTheDocument();
        expect(screen.getByText('PaymentAgentSearchContainer')).toBeInTheDocument();
    });

    it('should trigger setIsUnlistedWithdrawal callback when the suer is clicking on "search for them using their account number" text', () => {
        render(<PaymentAgentWithdrawal {...mockedProps} />);

        const unlistedWithdrawalLink = screen.getByTestId('dt_unlisted_withdrawal_link');
        userEvent.click(unlistedWithdrawalLink);

        expect(mockedSetIsUnlistedWithdrawal).toHaveBeenCalledWith(true);
    });

    it('should show loader when isPaymentAgentListLoading equals to true', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUsePaymentAgentContext.mockReturnValueOnce({ isPaymentAgentListLoading: true });

        render(<PaymentAgentWithdrawal {...mockedProps} />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });

    it('should show PaymentAgentWithdrawalConfirm when withdrawalStatus equals to `try_successful`', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUsePaymentAgentWithdrawalContext.mockReturnValueOnce({ withdrawalStatus: 'try_successful' });

        render(<PaymentAgentWithdrawal {...mockedProps} />);

        expect(screen.getByText('PaymentAgentWithdrawalConfirm')).toBeInTheDocument();
    });

    it('should show PaymentAgentWithdrawalReceipt when withdrawalStatus equals to `successful`', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUsePaymentAgentWithdrawalContext.mockReturnValueOnce({ withdrawalStatus: 'successful' });

        render(<PaymentAgentWithdrawal {...mockedProps} />);

        expect(screen.getByText('PaymentAgentWithdrawalReceipt')).toBeInTheDocument();
    });

    it('should show PaymentAgentUnlistedWithdrawalForm when isUnlistedWithdrawal equals to true', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUsePaymentAgentWithdrawalContext.mockReturnValueOnce({ isUnlistedWithdrawal: true });

        render(<PaymentAgentWithdrawal {...mockedProps} />);

        expect(screen.getByText('PaymentAgentUnlistedWithdrawalForm')).toBeInTheDocument();
    });
});
