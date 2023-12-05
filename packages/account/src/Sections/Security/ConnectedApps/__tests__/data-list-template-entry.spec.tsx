import React from 'react';
import { render, screen } from '@testing-library/react';
import DataListTemplateEntry from '../data-list-template-entry';

describe('DataListTemplateEntry', () => {
    it("should render the 'DataListTemplateEntry' component with correct details", () => {
        const mock_props: React.ComponentProps<typeof DataListTemplateEntry> = {
            title: 'MOCK_TITLE',
            content: 'MOCK_CONTENT',
        };
        render(<DataListTemplateEntry {...mock_props} />);

        expect(screen.getByText(mock_props.title.toString())).toBeInTheDocument();
        expect(screen.getByText(mock_props.content.toString())).toBeInTheDocument();
    });
});
