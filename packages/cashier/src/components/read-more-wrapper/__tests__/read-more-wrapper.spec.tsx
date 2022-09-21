import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ReadMoreWrapper from '../read-more-wrapper';

describe('<ReadMoreWrapper />', () => {
    const openDialog = jest.fn();

    it('should render ReadMoreWrapper component and open dialog on click', () => {
        render(<ReadMoreWrapper error_content='this is string' openDialog={openDialog} />);

        const read_more_element = screen.getByText('more');
        fireEvent.click(read_more_element);

        expect(openDialog).toHaveBeenCalled();
    });
});
