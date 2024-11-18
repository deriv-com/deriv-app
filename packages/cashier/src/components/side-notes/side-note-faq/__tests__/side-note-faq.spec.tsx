import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import SideNoteFAQ from '../side-note-faq';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mock = mockStore({});
const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

describe('SideNoteFAQ', () => {
    it('should render faq regarding deposit', () => {
        render(<SideNoteFAQ transaction_type='deposit' />, { wrapper });

        expect(screen.getByText('Why can’t I see the funds deposited in my Deriv account?')).toBeInTheDocument();
        expect(screen.getByText('What do I do if I have reached my deposit limit?')).toBeInTheDocument();
        expect(screen.getByText('Why is my card/e-wallet not working?')).toBeInTheDocument();
        expect(screen.getByText("Can I use someone else's payment method?")).toBeInTheDocument();
    });

    it('should render faq regarding withdrawal', () => {
        render(<SideNoteFAQ transaction_type='withdraw' />, { wrapper });

        expect(
            screen.getByText("Why can't I see the funds on my card/e-wallet balance after I've made a withdrawal?")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Your withdrawal will be processed internally in one business day. After that, for debit/credit cards, it takes 1-15 working days, and for e-wallets, it's 1-3 working days. If there's a delay beyond these periods, please contact us via live chat."
            )
        ).toBeInTheDocument();
        expect(screen.getByText("Why can't I use a payment agent to withdraw my funds?")).toBeInTheDocument();
        expect(screen.getByText('How do I cancel my withdrawal?')).toBeInTheDocument();
        expect(screen.getByText('Can I withdraw using a different method?')).toBeInTheDocument();
    });
});
