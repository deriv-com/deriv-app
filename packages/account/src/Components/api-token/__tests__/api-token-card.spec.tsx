import React from 'react';
import { Formik, Form } from 'formik';
import { screen, render } from '@testing-library/react';
import ApiTokenCard from '../api-token-card';

describe('<ApiTokenCard />', () => {
    const mock_props: React.ComponentProps<typeof ApiTokenCard> = {
        name: 'Api_token_card_test_case',
        display_name: <div>API Token Card</div>,
        description: <div>API Token Description</div>,
    };

    const renderComponent = (children?: JSX.Element) => {
        render(
            <Formik initialValues={{ [mock_props.name]: false }} onSubmit={jest.fn()}>
                <Form>
                    <ApiTokenCard {...mock_props}>{children}</ApiTokenCard>
                </Form>
            </Formik>
        );
    };

    it('should render ApiTokenCard', () => {
        renderComponent();
        expect(screen.getByText('API Token Card')).toBeInTheDocument();
        expect(screen.getByText('API Token Description')).toBeInTheDocument();
    });

    it('should render ApiTokenCard with children', () => {
        const children = <div>API Token Children</div>;
        renderComponent(children);
        expect(screen.getByText('API Token Children')).toBeInTheDocument();
    });
});
