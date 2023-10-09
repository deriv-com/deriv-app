import React from 'react';
import { render, screen } from '@testing-library/react';
import DataListTemplate from '../data-list-template';

describe('DataListTemplate', () => {
    it("should render the 'DataListTemplate' component with correct details", () => {
        const mock_props = {
            data_source: {
                app_id: 99,
                app_markup_percentage: 1,
                last_used: 'LAST_USED',
                name: 'NAME',
                official: 0,
                scopes: ['read', 'admin'],
            },
            handleToggleModal: () => undefined,
        };
        const mock_permissions = mock_props.data_source.scopes
            .map(scope => scope.charAt(0).toUpperCase().concat(scope.substring(1)))
            .join(', ');
        render(<DataListTemplate {...mock_props} />);

        expect(screen.getByText(mock_props.data_source.name)).toBeInTheDocument();
        expect(screen.getByText(mock_props.data_source.last_used)).toBeInTheDocument();
        expect(screen.getByText(mock_permissions)).toBeInTheDocument();
    });
});
