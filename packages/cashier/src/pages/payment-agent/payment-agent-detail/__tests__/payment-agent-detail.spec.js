import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDetail from '../payment-agent-detail';

describe('<PaymentAgentDetail />', () => {
    const props = {
        action: 'tel',
        children: '+12345678',
        has_red_color: false,
        icon: 'phone_icon',
        is_link: false,
        title: 'Phone',
    };
    it('should show proper icon, title and description', () => {
        render(<PaymentAgentDetail {...props} />);

        expect(screen.getByTestId('dt_payment_agent_detail_icon')).toBeInTheDocument();
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.getByText('+12345678')).toBeInTheDocument();
    });

    it('should show proper description if children is an array', () => {
        render(<PaymentAgentDetail {...props} children={['+12345678', '+87654321']} />);

        expect(screen.getByText('+12345678,')).toBeInTheDocument();
        expect(screen.getByText('+87654321')).toBeInTheDocument();
    });

    it('should show description as a link if is_link or action were defined', () => {
        const { rerender } = render(<PaymentAgentDetail {...props} />);

        expect(screen.getByTestId('dt_payment_agent_detail_link')).toBeInTheDocument();

        rerender(<PaymentAgentDetail {...props} action='' is_link />);

        expect(screen.getByTestId('dt_payment_agent_detail_link')).toBeInTheDocument();
    });

    it('should show description as a paragraph if is_link or action were not defined', () => {
        render(<PaymentAgentDetail {...props} action='' />);

        expect(screen.getByTestId('dt_payment_agent_detail_paragraph')).toBeInTheDocument();
    });
});
