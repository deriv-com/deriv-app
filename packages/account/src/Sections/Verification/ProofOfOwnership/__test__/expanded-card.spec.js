import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandedCard from '../expanded-card.jsx';
import { grouped_payment_method_data } from './test-data.js';

describe('expanded-card.jsx', () => {
    it('should display correct identifier', () => {
        render(
            <ExpandedCard
                card_details={grouped_payment_method_data.visa}
                index={0}
                item_index={0}
                values={{
                    data: [
                        [
                            {
                                payment_method_identifier: '1234 56XX XXXX 1121',
                            },
                        ],
                    ],
                }}
                setFieldValue={jest.fn(() => {})}
            />
        );
        const element = screen.getByDisplayValue('1234 56XX XXXX 1121');
        expect(element).toBeInTheDocument();
    });
    it('should show example link for credit/debit card and render the correct identifier label', () => {
        render(<ExpandedCard card_details={grouped_payment_method_data.visa} />);
        const exampelLink = screen.getByText('See example');
        expect(exampelLink).toBeInTheDocument();
        const element = screen.getByText('Card number');
        expect(element).toBeInTheDocument();
    });
    it('should render payment method link in the description', () => {
        render(<ExpandedCard card_details={grouped_payment_method_data.onlinenaira} />);
        const element = screen.getByText(
            'Upload a screenshot of your username on the General Information page at https://onlinenaira.com/members/index.htm'
        );
        expect(element).toBeInTheDocument();
    });
});
