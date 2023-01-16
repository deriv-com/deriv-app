import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../empty-state';

describe('EmptyState', () => {
    test('should only render title', () => {
        render(<EmptyState title='foo' />);

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toHaveTextContent('foo');

        expect(screen.queryByTestId('dt_empty_state_icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).not.toBeInTheDocument();
    });

    test('should only render description', () => {
        render(<EmptyState description='foo' />);

        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toHaveTextContent('foo');

        expect(screen.queryByTestId('dt_empty_state_icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).not.toBeInTheDocument();
    });

    test('should only render title and description', () => {
        render(<EmptyState title='foo' description='bar' />);

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toHaveTextContent('foo');
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toHaveTextContent('bar');

        expect(screen.queryByTestId('dt_empty_state_icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).not.toBeInTheDocument();
    });

    test('should only render icon and title', () => {
        render(<EmptyState icon='foo' title='bar' />);

        expect(screen.queryByTestId('dt_empty_state_icon')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toHaveTextContent('bar');

        expect(screen.queryByTestId('dt_empty_state_description')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).not.toBeInTheDocument();
    });

    test('should only render icon and description', () => {
        render(<EmptyState icon='foo' description='bar' />);

        expect(screen.queryByTestId('dt_empty_state_icon')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toHaveTextContent('bar');

        expect(screen.queryByTestId('dt_empty_state_title')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).not.toBeInTheDocument();
    });

    test('should only render icon and and title and description', () => {
        render(<EmptyState icon='foo' title='bar' description='baz' />);

        expect(screen.queryByTestId('dt_empty_state_icon')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toHaveTextContent('bar');
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toHaveTextContent('baz');

        expect(screen.queryByTestId('dt_empty_state_action')).not.toBeInTheDocument();
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

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toHaveTextContent('foo');
        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).toHaveTextContent('Bar');

        expect(screen.queryByTestId('dt_empty_state_icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).not.toBeInTheDocument();
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

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toHaveTextContent('foo');
        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).toHaveTextContent('Bar');
        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();

        expect(screen.queryByTestId('dt_empty_state_icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).not.toBeInTheDocument();
    });
});
