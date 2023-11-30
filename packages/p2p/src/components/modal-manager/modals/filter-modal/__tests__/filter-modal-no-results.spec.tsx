import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterModalNoResults from '../filter-modal-no-results';

const mock_props = {
    text: 'test word',
};

describe('<FilterModalNoResults />', () => {
    it('should render the component with the passed props', () => {
        render(<FilterModalNoResults {...mock_props} />);
        expect(screen.getByText('No results for "test word".')).toBeInTheDocument();
        expect(screen.getByText('Check your spelling or use a different term.')).toBeInTheDocument();
    });
});
