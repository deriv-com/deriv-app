import React from 'react';
import { Formik, Form } from 'formik';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiTokenCard from '../api-token-card';

describe('<ApiTokenCard />', () => {
    const mock_props = {
        name: 'Api_token_card_test_case',
        value: false,
        display_name: 'API Token Card',
        description: 'API Token Description',
        setFieldValue: jest.fn(),
    };

    it('should render ApiTokenCard', () => {
        render(
            <Formik initialValues={{ [mock_props.name]: mock_props.value }} onSubmit={jest.fn()}>
                <Form>
                    <ApiTokenCard {...mock_props} />
                </Form>
            </Formik>
        );
        expect(screen.getByText('API Token Card')).toBeInTheDocument();
        expect(screen.getByText('API Token Description')).toBeInTheDocument();
    });

    it('should render ApiTokenCard with children', () => {
        const children = <div>API Token Children</div>;

        render(
            <Formik initialValues={{ [mock_props.name]: mock_props.value }} onSubmit={jest.fn()}>
                <Form>
                    <ApiTokenCard {...mock_props}>{children}</ApiTokenCard>
                </Form>
            </Formik>
        );
        expect(screen.getByText('API Token Children')).toBeInTheDocument();
    });

    it('should run setFieldValue after clicking on checkbox', () => {
        render(
            <Formik initialValues={{ [mock_props.name]: mock_props.value }} onSubmit={jest.fn()}>
                <Form>
                    <ApiTokenCard {...mock_props} />
                </Form>
            </Formik>
        );
        const message = screen.getByText('API Token Card');
        userEvent.click(message);
        expect(mock_props.setFieldValue).toBeCalled();
    });
});
