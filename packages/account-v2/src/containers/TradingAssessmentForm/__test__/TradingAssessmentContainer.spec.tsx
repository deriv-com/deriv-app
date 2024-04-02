import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradingAssessmentContainer } from '../TradingAssessmentContainer';

describe('TradingAssessmentContainer', () => {
    const answerList = [
        { text: 'Option 1', value: 'Option 1' },
        { text: 'Option 2', value: 'Option 2' },
        { text: 'Option 3', value: 'Option 3' },
    ];
    const question = 'Trading assessment question';
    const name = 'tradingAssessmentQuestion';
    const key = '1';

    it('should renders correctly with the question and dropdown', () => {
        render(<TradingAssessmentContainer answerList={answerList} key={key} name={name} question={question} />);

        expect(screen.getByText(question)).toBeInTheDocument();

        const dropdownIcon = screen.getByRole('combobox');
        expect(dropdownIcon).toBeInTheDocument();

        userEvent.click(dropdownIcon);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should correctly select a value', () => {
        render(<TradingAssessmentContainer answerList={answerList} key={key} name={name} question={question} />);

        expect(screen.getByText(question)).toBeInTheDocument();

        const dropdownIcon = screen.getByRole('combobox');
        expect(dropdownIcon).toBeInTheDocument();

        userEvent.click(dropdownIcon);

        const option1 = screen.getByText('Option 1');
        userEvent.click(option1);

        expect(dropdownIcon).toHaveValue('Option 1');
    });
});
