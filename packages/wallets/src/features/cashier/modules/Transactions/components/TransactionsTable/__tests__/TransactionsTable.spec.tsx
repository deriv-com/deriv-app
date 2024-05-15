import React from 'react';
import { useReactTable } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import TransactionsTable from '../TransactionsTable';

jest.mock('@tanstack/react-table', () => ({
    getCoreRowModel: jest.fn(() => jest.fn()),
    getGroupedRowModel: jest.fn(() => jest.fn()),
    useReactTable: jest.fn(),
}));

const mockRowRender = jest.fn(data => <div>Row: {data.name}</div>);
const mockRowGroupRender = jest.fn(data => <div>Group: {data.name}</div>);

describe('TransactionsTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render individual rows as group when there is no grouping', () => {
        (useReactTable as jest.Mock).mockReturnValue({
            getRowModel: () => ({
                rows: [
                    { id: 'row1', original: { name: 'Transaction 1' }, subRows: [] },
                    { id: 'row2', original: { name: 'Transaction 2' }, subRows: [] },
                ],
            }),
        });

        render(
            <TransactionsTable columns={[]} data={[]} rowGroupRender={mockRowGroupRender} rowRender={mockRowRender} />
        );
        expect(screen.getByText('Group: Transaction 1')).toBeInTheDocument();
        expect(screen.getByText('Group: Transaction 2')).toBeInTheDocument();
        expect(mockRowGroupRender).toHaveBeenCalledTimes(2);
        expect(mockRowRender).not.toHaveBeenCalled();
    });

    it('should render grouped rows correctly', () => {
        (useReactTable as jest.Mock).mockReturnValue({
            getRowModel: () => ({
                rows: [
                    {
                        id: 'group1',
                        original: { name: 'Group 1' },
                        subRows: [
                            { id: 'row1', original: { name: 'Transaction 1' } },
                            { id: 'row2', original: { name: 'Transaction 2' } },
                        ],
                    },
                ],
            }),
        });

        render(
            <TransactionsTable columns={[]} data={[]} rowGroupRender={mockRowGroupRender} rowRender={mockRowRender} />
        );
        expect(screen.getByText('Group: Group 1')).toBeInTheDocument();
        expect(screen.getByText('Row: Transaction 1')).toBeInTheDocument();
        expect(screen.getByText('Row: Transaction 2')).toBeInTheDocument();
        expect(mockRowGroupRender).toHaveBeenCalledTimes(1);
        expect(mockRowRender).toHaveBeenCalledTimes(2);
    });

    it('should handle empty data without crashing', () => {
        (useReactTable as jest.Mock).mockReturnValue({
            getRowModel: () => ({
                rows: [],
            }),
        });

        render(
            <TransactionsTable columns={[]} data={[]} rowGroupRender={mockRowGroupRender} rowRender={mockRowRender} />
        );
        expect(screen.queryByText(/Row:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Group:/)).not.toBeInTheDocument();
        expect(mockRowRender).not.toHaveBeenCalled();
        expect(mockRowGroupRender).not.toHaveBeenCalled();
    });
});
