import React from 'react';
import { render, screen } from '@testing-library/react';
import ListCell from '../list-cell';

const mock_title = 'List Cell Mock Title';
const mock_text = 'List Cell Mock Text';

it('should render ListCell', () => {
    render(<ListCell title={mock_title} text={mock_text} />);
    expect(screen.getByText(mock_title)).toBeInTheDocument();
    expect(screen.getByText(mock_text)).toBeInTheDocument();
});
