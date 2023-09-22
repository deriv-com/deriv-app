import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandedCard from './';
import { TPaymentMethodInfo } from 'Types';
import { Formik } from 'formik';

const grouped_payment_method_data: Record<string, TPaymentMethodInfo> = {
    visa: {
        icon: 'IcVisaLight',
        payment_method: 'visa',
        items: [
            {
                id: 4,
                payment_method: 'visa',
                documents_required: 1,
            },
        ],
        instructions: [
            'Upload a photo showing your name and the first six and last four digits of your card number. If the card does not display your name, upload the bank statement showing your name and card number in the transaction history.',
        ],
        input_label: 'Card number',
        identifier_type: 'card_number',
        is_generic_pm: false,
    },
    onlinenaira: {
        icon: 'IcOnlineNaira',
        payment_method: 'onlinenaira',
        items: [
            {
                id: 9,
                payment_method: 'onlinenaira',
                documents_required: 2,
            },
        ],
        instructions: [
            'Upload a screenshot of your username on the General Information page at https://onlinenaira.com/members/index.htm',
            'Upload a screenshot of your account number and phone number on the Bank Account/Mobile wallet page at https://onlinenaira.com/members/bank.htm',
        ],
        input_label: 'Account ID',
        identifier_type: 'account_id',
        is_generic_pm: false,
    },
};

describe('expanded-card.jsx', () => {
    const mock_props: React.ComponentProps<typeof ExpandedCard> = {
        card_details: grouped_payment_method_data.visa,
        index: 0,
        updateErrors: jest.fn(),
    };

    const renderComponent = ({ props = mock_props }) =>
        render(
            <Formik
                initialValues={{
                    data: [
                        [
                            {
                                payment_method_identifier: '1234 56XX XXXX 1121',
                            },
                        ],
                    ],
                }}
                onSubmit={jest.fn()}
            >
                <ExpandedCard {...props} />
            </Formik>
        );

    it('should display correct identifier', () => {
        // render(
        //     <Formik
        //         initialValues={{
        //             data: [
        //                 [
        //                     {
        //                         payment_method_identifier: '1234 56XX XXXX 1121',
        //                     },
        //                 ],
        //             ],
        //         }}
        //         onSubmit={jest.fn()}
        //     >
        //         <ExpandedCard {...mock_props} />
        //     </Formik>
        // );
        renderComponent({});

        expect(screen.getByDisplayValue('1234 56XX XXXX 1121')).toBeInTheDocument();
    });

    it('should show example link for credit/debit card and render the correct identifier label', () => {
        // render(<ExpandedCard card_details={grouped_payment_method_data.visa} />);
        renderComponent({});
        const el_example_link = screen.getByText('See example');
        expect(el_example_link).toBeInTheDocument();
        expect(screen.getByText('Card number')).toBeInTheDocument();
    });

    it('should render payment method link in the description', () => {
        // render(<ExpandedCard card_details={grouped_payment_method_data.onlinenaira} />);
        const new_props: React.ComponentProps<typeof ExpandedCard> = {
            ...mock_props,
            card_details: grouped_payment_method_data.onlinenaira,
        };
        renderComponent({ props: new_props });
        const element = screen.getByText(
            'Upload a screenshot of your username on the General Information page at https://onlinenaira.com/members/index.htm'
        );
        expect(element).toBeInTheDocument();
    });
});
