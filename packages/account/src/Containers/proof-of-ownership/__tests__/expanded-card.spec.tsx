import React from 'react';
import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import ExpandedCard from '../expanded-card';
import { TPaymentMethodInfo } from '../../../Types';

const grouped_payment_method_data: Record<string, TPaymentMethodInfo> = {
    visa: {
        icon: 'IcVisaLight',
        payment_method: 'visa',
        items: [
            {
                id: 4,
                payment_method: 'visa',
                documents_required: 1,
                creation_time: '1626265200',
            },
        ],
        instructions: ['mock instruction 1'],
        input_label: 'Card number',
        identifier_type: 'card_number',
        is_generic_pm: false,
        documents_required: 1,
    },
    onlinenaira: {
        icon: 'IcOnlineNaira',
        payment_method: 'onlinenaira',
        items: [
            {
                id: 9,
                payment_method: 'onlinenaira',
                documents_required: 2,
                creation_time: '1626265200',
            },
        ],
        instructions: [
            'Upload a screenshot of your username on the General Information page at https://onlinenaira.com/members/index.htm',
            'Upload a screenshot of your account number and phone number on the Bank Account/Mobile wallet page at https://onlinenaira.com/members/bank.htm',
        ],
        input_label: 'Account ID',
        identifier_type: 'account_id',
        is_generic_pm: false,
        documents_required: 0,
    },
};

describe('expanded-card.jsx', () => {
    const mock_props: React.ComponentProps<typeof ExpandedCard> = {
        card_details: grouped_payment_method_data.visa,
    };

    const renderComponent = ({ props = mock_props }) =>
        render(
            <Formik
                initialValues={{
                    visa: {
                        '4': {
                            payment_method_identifier: '1234 56XX XXXX 1121',
                        },
                    },
                }}
                onSubmit={jest.fn()}
            >
                <ExpandedCard {...props} />
            </Formik>
        );

    it('should display correct identifier', () => {
        renderComponent({});

        expect(screen.getByDisplayValue('1234 56XX XXXX 1121')).toBeInTheDocument();
    });

    it('should show example link for credit/debit card and render the correct identifier label', () => {
        renderComponent({});
        const el_example_link = screen.getByText('See example');
        expect(el_example_link).toBeInTheDocument();
        expect(screen.getByText('Card number')).toBeInTheDocument();
    });

    it('should render payment method link in the description', () => {
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
