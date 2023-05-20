import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import SideNoteCard from '../side-note-card';

describe('SideNoteCard', () => {
    test('should render the given title and description', async () => {
        const props: React.ComponentProps<typeof SideNoteCard> = {
            title: 'foo',
            description: 'bar',
        };
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<SideNoteCard {...props} />, { wrapper });

        expect(screen.getByText('foo')).toBeInTheDocument();
        expect(screen.getByText('bar')).toBeInTheDocument();
    });
});
