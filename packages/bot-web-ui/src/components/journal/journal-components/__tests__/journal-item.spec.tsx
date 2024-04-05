import React from 'react';
import { LogTypes, MessageTypes } from '@deriv/bot-skeleton';
import { render, screen } from '@testing-library/react';
import JournalItem from '../journal-item';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

const mockMeasure = jest.fn();

const journalItemProps = {
    is_new_row: true,
    measure: mockMeasure,
};

const mockRowData = {
    unique_id: '11111',
    date: '2023-10-10',
    time: '12:00',
    className: 'test-class',
    extra: {
        currency: '',
        profit: 1,
    },
};

const mockRowDataDefault = {
    ...mockRowData,
    message_type: '',
    message: 'Default message',
};

const mockRowDataError = {
    ...mockRowData,
    message_type: MessageTypes.ERROR,
    message: 'Error message',
};

const mockRowDataNotifier = {
    ...mockRowData,
    message_type: MessageTypes.NOTIFY,
    message: 'Notify message',
};

const mockRowDataNotifierWithFunc = {
    ...mockRowData,
    message_type: MessageTypes.NOTIFY,
    message: jest.fn(),
};

const mockRowDataSuccess = {
    ...mockRowData,
    message_type: MessageTypes.SUCCESS,
    message: LogTypes.LOAD_BLOCK,
};

describe('JournalItem', () => {
    it('Should render default JournalItem flow', () => {
        render(<JournalItem row={mockRowDataDefault} {...journalItemProps} />);

        const journal_item = screen.getByTestId('mock-css-transition');

        expect(journal_item).toBeInTheDocument();
    });

    it('Should render JournalItem with an Error message', () => {
        render(<JournalItem row={mockRowDataError} {...journalItemProps} />);

        const journal_item = screen.getByTestId('mock-css-transition');

        expect(journal_item).toBeInTheDocument();
        expect(journal_item).toHaveTextContent('Error message');
    });

    it('Should render JournalItem with an Notify message', () => {
        render(<JournalItem row={mockRowDataNotifier} {...journalItemProps} />);

        const journal_item = screen.getByTestId('mock-css-transition');

        expect(journal_item).toBeInTheDocument();
        expect(journal_item).toHaveTextContent('Notify message');
    });

    it('Should render JournalItem with an Notify function', () => {
        render(<JournalItem row={mockRowDataNotifierWithFunc} {...journalItemProps} />);

        const journal_item = screen.getByTestId('mock-css-transition');

        expect(journal_item).toBeInTheDocument();
    });

    it('Should render JournalItem with a Success row data message "Blocks are loaded successfully"', () => {
        render(<JournalItem row={mockRowDataSuccess} {...journalItemProps} />);

        const journal_item = screen.getByTestId('mock-css-transition');

        expect(journal_item).toHaveTextContent('Blocks are loaded successfully');
        expect(journal_item).toBeInTheDocument();
    });
});
