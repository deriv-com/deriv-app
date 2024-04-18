import React from 'react';
import { render, screen } from '@testing-library/react';
import { TradingAssessmentContainer } from '../TradingAssessmentContainer';

jest.mock('../../../components/FormFields/', () => ({
    ...jest.requireActual('../../../components/FormFields'),
    FormDropDownField: jest.fn(() => <div data-testid='dt_dropdown' />),
}));

describe('TradingAssessmentContainer', () => {
    const mockProps: React.ComponentProps<typeof TradingAssessmentContainer> = {
        answerList: [
            { text: 'Option 1', value: 'Option 1' },
            { text: 'Option 2', value: 'Option 2' },
            { text: 'Option 3', value: 'Option 3' },
        ],
        key: '1',
        name: 'tradingAssessmentQuestion',
        question: 'Trading assessment question',
    };

    it('should renders correctly with the question and dropdown', () => {
        render(<TradingAssessmentContainer {...mockProps} />);

        expect(screen.getByText(mockProps.question)).toBeInTheDocument();

        const dropdownIcon = screen.getByTestId('dt_dropdown');
        expect(dropdownIcon).toBeInTheDocument();
    });
});
