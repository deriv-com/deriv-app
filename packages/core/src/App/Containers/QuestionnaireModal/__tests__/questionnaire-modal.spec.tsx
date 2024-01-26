import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import QuestionnaireModal from '../questionnaire-modal';
import userEvent from '@testing-library/user-event';
import crypto from 'crypto';

window.dataLayer = [];

describe('QuestionnaireModal', () => {
    const mock_props = {
        ab_questionnaire: [
            {
                id: '1',
                question: 'Default question',
                show_answers_in_random_order: true,
                answers: [
                    { code: 'a', text: 'Default A' },
                    { code: 'b', text: 'Default B', header: 'Default Header B' },
                ],
            },
            {
                id: '1',
                question: 'Sample question',
                show_answers_in_random_order: false,
                answers: [
                    { code: 'a', text: 'Option A' },
                    { code: 'b', text: 'Option B', header: 'Header B' },
                ],
            },
        ],
        handleSignup: jest.fn(),
    };

    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        Object.defineProperty(global, 'crypto', {
            value: {
                getRandomValues: (arr: Uint32Array) => crypto.randomBytes(arr.length),
            },
        });
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('renders QuestionnaireModal component correctly', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <QuestionnaireModal {...mock_props} />
            </Formik>
        );
        expect(screen.getByText('Sample question')).toBeInTheDocument();
    });

    it('calls handleSignup when an answer is clicked', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <QuestionnaireModal {...mock_props} />
            </Formik>
        );
        const option_a = screen.getByTestId('dt_questionnaire_a');
        userEvent.click(option_a);
        expect(mock_props.handleSignup).toHaveBeenCalledTimes(1);
    });
});
