import React from 'react';
import { render, screen } from '@testing-library/react';
import NoResultsMessage from '../ContractTypeMenu/no-results-message';

describe('<NoResultsMessage />', () => {
    it('should render correct text when result is not found', () => {
        render(<NoResultsMessage text='test' />);
        expect(screen.getByText(/No results for "test"/i)).toBeInTheDocument();
        expect(screen.getByText(/try checking your spelling/i)).toBeInTheDocument();
    });
});
