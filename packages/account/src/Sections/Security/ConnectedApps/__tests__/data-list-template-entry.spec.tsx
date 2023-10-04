import React from 'react';
import { render, screen } from '@testing-library/react';
import DataListTemplateEntry from '../data-list-template-entry';

describe('DataListTemplateEntry', () => {
    it("should render the 'Know more' section with correct details", () => {
        const mock_props = { title: 'MOCK_TITLE', content: 'MOCK_CONTENT' };
        render(<DataListTemplateEntry {...mock_props} />);

        expect(screen.getByText(mock_props.title)).toBeInTheDocument();
        expect(screen.getByText(mock_props.content)).toBeInTheDocument();
    });
});
