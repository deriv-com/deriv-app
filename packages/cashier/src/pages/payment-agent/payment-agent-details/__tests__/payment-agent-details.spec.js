import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDetails from '../payment-agent-details';

describe('<PaymentAgentDetails />', () => {
    const props = {
        payment_agent_phones: '+12345678, +12345679',
        payment_agent_urls: 'http://www.MyPAMyAdventure.com/, http://www.MyPAMyAdventure2.com/',
        payment_agent_email: 'MyPaScript@example.com',
    };

    it('should render proper phones, urls and emails', () => {
        const { rerender } = render(<PaymentAgentDetails {...props} />);

        expect(screen.getByText('+12345678,')).toBeInTheDocument();
        expect(screen.getByText('+12345679')).toBeInTheDocument();
        expect(screen.getByText('http://www.MyPAMyAdventure.com/,')).toBeInTheDocument();
        expect(screen.getByText('http://www.MyPAMyAdventure2.com/')).toBeInTheDocument();
        expect(screen.getByText('MyPaScript@example.com')).toBeInTheDocument();

        rerender(
            <PaymentAgentDetails
                {...props}
                payment_agent_phones={[{ phone_number: '+12345679' }]}
                payment_agent_urls={[{ url: 'http://www.MyPAMyAdventure2.com/' }]}
            />
        );

        expect(screen.getByText('+12345679')).toBeInTheDocument();
        expect(screen.getByText('http://www.MyPAMyAdventure2.com/')).toBeInTheDocument();
        expect(screen.getByText('MyPaScript@example.com')).toBeInTheDocument();
    });
});
