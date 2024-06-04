import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentCardDescription from '../PaymentAgentCardDescription';
import { MemoryHistory, createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('PaymentAgentCardDescription', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentCardDescription>;
    let history: MemoryHistory;

    beforeEach(() => {
        mockedProps = {
            //@ts-expect-error since this is a mock, we only need partial properties of payment agent
            paymentAgent: {
                further_information: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                name: 'Payment agent name',
                supported_payment_methods: [{ payment_method: 'Card' }, { payment_method: 'Diamondbank' }],
                urls: [{ url: 'https://url1.com' }, { url: 'https://url2.com' }],
            },
        };

        history = createMemoryHistory();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => {
        return <Router history={history}>{children}</Router>;
    };

    it('should render proper payment agent card description', () => {
        render(<PaymentAgentCardDescription {...mockedProps} />, { wrapper });

        expect(screen.getByText('Payment agent name')).toBeInTheDocument();
        expect(
            screen.getByText('Lorem Ipsum is simply dummy text of the printing and typesetting industry.')
        ).toBeInTheDocument();
        expect(screen.getByText(/https:\/\/url1.com/)).toBeInTheDocument();
        expect(screen.getByText(/https:\/\/url2.com/)).toBeInTheDocument();

        const icons = screen.getAllByTestId('dt_payment_method_icon');

        expect(icons.length).toBe(2);
    });
});
