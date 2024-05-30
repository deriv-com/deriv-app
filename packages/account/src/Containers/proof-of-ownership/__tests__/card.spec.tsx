import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../card';

jest.mock('../expanded-card', () => jest.fn(() => <div>Expanded Card</div>));

describe('Card', () => {
    const mock_props: React.ComponentProps<typeof Card> = {
        details: {
            icon: 'IcVisaLight',
            payment_method: 'visa',
            items: [
                {
                    creation_time: '1699433416524',
                    id: 4,
                    payment_method: 'visa',
                    documents_required: 1,
                },
            ],
            instructions: ['mock instruction 1', 'mock instruction 2'],
            input_label: 'Card number',
            identifier_type: 'card_number',
            is_generic_pm: false,
            documents_required: 1,
        },
    };

    it('should render payment method card', () => {
        render(<Card {...mock_props} />);
        expect(screen.getByText('visa')).toBeInTheDocument();
    });

    it('should render expanded card when clicked', () => {
        render(<Card {...mock_props} />);

        userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Expanded Card')).toBeInTheDocument();
    });

    it('should close the rendered expanded card when clicked', () => {
        render(<Card {...mock_props} />);

        userEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Expanded Card')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText('Expanded Card')).not.toBeInTheDocument();
    });
});
