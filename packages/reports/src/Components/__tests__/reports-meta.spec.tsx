import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportsMeta } from '../reports-meta';

const mockFilterComponent = 'mockFilterComponent';
const mockClassName = 'mockClassName';
const mockProps = {
    filter_component: mockFilterComponent,
    className: mockClassName,
};

describe('ReportsMeta', () => {
    it('should render passed filter_component inside of wrapper div with specific className if className was passed', () => {
        render(<ReportsMeta {...mockProps} />);

        expect(screen.getByTestId('dt_reports_meta_wrapper')).toHaveClass(mockClassName);
        expect(screen.getByText(mockFilterComponent)).toBeInTheDocument();
    });

    it('should render filter_component with specific className if is_statement === true', () => {
        render(<ReportsMeta {...mockProps} is_statement />);

        expect(screen.getByText(mockFilterComponent)).toHaveClass('reports__meta-filter--statement');
    });
});
