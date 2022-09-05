import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../empty-state';

describe('EmptyState', () => {
    test('should only render title', () => {
        render(<EmptyState title='foo' />);

        expect(screen.queryByTestId('empty-state-title')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toHaveTextContent('foo');

        expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
    });

    test('should only render description', () => {
        render(<EmptyState description='foo' />);

        expect(screen.queryByTestId('empty-state-description')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).toHaveTextContent('foo');

        expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
    });

    test('should only render title and description', () => {
        render(<EmptyState title='foo' description='bar' />);

        expect(screen.queryByTestId('empty-state-title')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toHaveTextContent('foo');
        expect(screen.queryByTestId('empty-state-description')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).toHaveTextContent('bar');

        expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
    });

    test('should only render icon and title', () => {
        render(<EmptyState icon='foo' title='bar' />);

        expect(screen.queryByTestId('empty-state-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toHaveTextContent('bar');

        expect(screen.queryByTestId('empty-state-description')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
    });

    test('should only render icon and description', () => {
        render(<EmptyState icon='foo' description='bar' />);

        expect(screen.queryByTestId('empty-state-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).toHaveTextContent('bar');

        expect(screen.queryByTestId('empty-state-title')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
    });

    test('should only render icon and and title and description', () => {
        render(<EmptyState icon='foo' title='bar' description='baz' />);

        expect(screen.queryByTestId('empty-state-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toHaveTextContent('bar');
        expect(screen.queryByTestId('empty-state-description')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).toHaveTextContent('baz');

        expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
    });

    test('should render the empty state with the given action button', () => {
        render(
            <EmptyState
                title='foo'
                action={{
                    label: 'bar',
                }}
            />
        );

        expect(screen.queryByTestId('empty-state-title')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toHaveTextContent('foo');
        expect(screen.queryByTestId('empty-state-action')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).toHaveTextContent('Bar');

        expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).not.toBeInTheDocument();
    });

    test('should render the empty state with disabled action button', () => {
        render(
            <EmptyState
                title='foo'
                action={{
                    label: 'bar',
                    disabled: true,
                }}
            />
        );

        expect(screen.queryByTestId('empty-state-title')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-title')).toHaveTextContent('foo');
        expect(screen.queryByTestId('empty-state-action')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-action')).toHaveTextContent('Bar');
        expect(screen.queryByTestId('empty-state-action')).toBeDisabled();

        expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-description')).not.toBeInTheDocument();
    });
});
