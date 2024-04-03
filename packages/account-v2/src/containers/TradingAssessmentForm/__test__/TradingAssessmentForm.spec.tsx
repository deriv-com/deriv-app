import React from 'react';
import { render, screen } from '@testing-library/react';
import { TradingAssessmentForm } from '../TradingAssessmentForm';

jest.mock('../../../components/FormFields/', () => ({
    ...jest.requireActual('../../../components/FormFields'),
    FormDropDownField: jest.fn(() => <div data-testid='dt_dropdown' />),
}));

describe('TradingAssessmentForm', () => {
    const questions = [
        'Do you understand that you could potentially lose 100% of the money you use to trade?',
        'How much knowledge and experience do you have in relation to online trading?',
        'How much experience do you have in CFD trading?',
        'How many CFD trades have you placed in the past 12 months?',
        'How much experience do you have with other financial instruments?',
        'How many trades have you placed with other financial instruments in the past 12 months?',
        'In your understanding, CFD trading allows you to',
        'How does leverage affect CFD trading?',
        "Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to",
        'When are you required to pay an initial margin?',
    ];
    it('should render TradingAssessmentForm', () => {
        render(<TradingAssessmentForm />);
        expect(screen.getByText('Trading assessment')).toBeInTheDocument();
        questions.forEach(question => expect(screen.getByText(question)).toBeInTheDocument());
    });
});
