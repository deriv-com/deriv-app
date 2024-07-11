import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportsTableRowLoader } from '../reports-table-row';

jest.mock('react-content-loader', () => ({
    __esModule: true,
    default: ({ speed }: { speed?: number }) => <div>ContentLoader speed: {speed}s</div>,
}));

describe('ReportsTableRowLoader', () => {
    it('should render ContentLoader', () => {
        render(<ReportsTableRowLoader />);
        expect(screen.getByText(/ContentLoader/)).toBeInTheDocument();
    });
    it('should render ContentLoader with a custom animation speed', () => {
        render(<ReportsTableRowLoader speed={0.7} />);
        expect(screen.getByText('ContentLoader speed: 0.7s')).toBeInTheDocument();
    });
});
