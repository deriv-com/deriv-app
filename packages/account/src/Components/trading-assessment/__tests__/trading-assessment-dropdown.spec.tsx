import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';
import TradingAssessmentDropdown from '../trading-assessment-dropdown';
import { TQuestion } from 'Types';
import userEvent from '@testing-library/user-event';

describe('TradingAssessmentDropdown', () => {
    const mockItemList: TQuestion[] = [
        {
            answer_options: [
                { text: 'No experience', value: 'No experience' },
                { text: 'Less than a year', value: 'Less than a year' },
                { text: '1-2 years', value: '1-2 years' },
                { text: 'over 3 years', value: 'over 3 years' },
            ],
            field_type: 'dropdown',
            form_control: 'cfd_experience',
            question_text: 'How much experience do you have in CFD trading?',
        },
    ];
    const values = {
        cfd_experience: '',
        cfd_frequency: '',
        cfd_trading_definition: '',
        leverage_impact_trading: '',
        leverage_trading_high_risk_stop_loss: '',
        required_initial_margin: '',
        risk_tolerance: '',
        source_of_experience: '',
        trading_experience_financial_instruments: '',
        trading_frequency_financial_instruments: '',
    };
    const setup = (initialValues = {}, disabledItems = []) => {
        const setEnableNextSection = jest.fn();
        const utils = render(
            <Formik initialValues={initialValues} onSubmit={jest.fn()}>
                {({ setFieldValue }) => (
                    <Form>
                        <TradingAssessmentDropdown
                            item_list={mockItemList}
                            disabled_items={disabledItems}
                            onChange={(e, form_control, setFieldValue) => {
                                setFieldValue(form_control, e.target.value);
                            }}
                            values={values}
                            setFieldValue={setFieldValue}
                            setEnableNextSection={setEnableNextSection}
                        />
                    </Form>
                )}
            </Formik>
        );
        return { ...utils, setEnableNextSection };
    };

    it('renders questions from item_list', () => {
        const { getByText } = setup();
        mockItemList.forEach(item => {
            expect(getByText(item.question_text)).toBeInTheDocument();
        });
    });

    it('calls setEnableNextSection with false if not all fields are filled', () => {
        const { setEnableNextSection } = setup({ cfd_experience: 'yes' });
        expect(setEnableNextSection).toHaveBeenCalledWith(false);
    });

    it('should show all the options', async () => {
        const { getByText } = setup();
        const dropdown = getByText('How much experience do you have in CFD trading?');
        expect(dropdown).toBeInTheDocument();
        await waitFor(() => {
            userEvent.click(dropdown);
        });
        const option1 = getByText('No experience');
        const option2 = getByText('Less than a year');
        const option3 = getByText('1-2 years');
        const option4 = getByText('over 3 years');
        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
        expect(option3).toBeInTheDocument();
        expect(option4).toBeInTheDocument();
    });

    it('updates form values on dropdown change', async () => {
        const { getByText } = setup();
        const dropdown = getByText('How much experience do you have in CFD trading?');
        await waitFor(() => {
            userEvent.click(dropdown);
        });
        const option = getByText('No experience');
        userEvent.click(option);
        await waitFor(() => {
            expect(getByText('No experience')).toBeInTheDocument();
        });
    });
});
