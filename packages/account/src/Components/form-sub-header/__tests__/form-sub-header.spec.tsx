import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormSubHeader, TFormSubHeader } from '../form-sub-header';

describe('Testing FormSubHeader component', () => {
    it('should render properties', () => {
        const props: TFormSubHeader = {
            title: 'test-title',
            subtitle: 'test-subtitle',
            description: 'lorem ipsum',
        };
        render(<FormSubHeader {...props} />);
        expect(screen.getByText('test-title')).toBeInTheDocument();
        expect(screen.getByText('test-subtitle')).toBeInTheDocument();
        expect(screen.getByText('lorem ipsum')).toBeInTheDocument();
    });

    it('Should has a title as class', () => {
        const test_title = 'test-title';
        render(<FormSubHeader title={test_title} />);
        const title_as_class = test_title.replace(/\s+/g, '-').toLowerCase();
        expect(screen.getByTestId('form-sub-header')).toHaveClass(title_as_class);
    });
});
