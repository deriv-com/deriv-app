import React from 'react';
import EmptyState from '../empty-state';
import { render, screen } from '@testing-library/react';

describe('EmptyState', () => {
    it('should render correctly', () => {
        const { container } = render(
            <EmptyState
                icon_name='icon_name'
                renderMessage={() => (
                    <>
                        <p>Message</p>
                        <p>Some content</p>
                    </>
                )}
                renderTitle={() => <p>Title</p>}
            />
        );
        expect(container).toBeInTheDocument();
    });

    it('should render correctly with the correct text', () => {
        const { container } = render(
            <EmptyState
                icon_name='icon_name'
                renderMessage={() => (
                    <>
                        <p>Message</p>
                        <p>Some content</p>
                    </>
                )}
                renderTitle={() => <p>Title</p>}
            />
        );

        expect(container).toBeInTheDocument();
        expect(screen.getByText('Message')).toBeInTheDocument();
        expect(screen.getByText('Some content')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
    });
});
