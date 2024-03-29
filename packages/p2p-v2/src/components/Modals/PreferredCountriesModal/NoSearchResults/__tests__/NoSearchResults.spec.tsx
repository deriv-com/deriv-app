import React from 'react';
import { render, screen } from '@testing-library/react';
import NoSearchResults from '../NoSearchResults';

describe('NoSearchResults', () => {
    it('should render', () => {
        render(<NoSearchResults value='test' />);
        expect(screen.getByText('No results for “test”.')).toBeInTheDocument();
        expect(screen.getByText('Check your spelling or use a different term.')).toBeInTheDocument();
    });
});
