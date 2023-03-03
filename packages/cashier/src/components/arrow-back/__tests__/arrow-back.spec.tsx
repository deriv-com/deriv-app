import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArrowBack from '../arrow-back';

describe('<ArrowBack />', () => {
    it('should render arrow back component', () => {
        render(<ArrowBack />);

        expect(screen.getByTestId('dt_arrow_back')).toBeInTheDocument();
    });

    it('should trigger onclick callback when the user clicks on arrow back', () => {
        const onClick = jest.fn();
        render(<ArrowBack onClickHandler={onClick} />);

        const el_arrow_back = screen.getByTestId('dt_arrow_back');
        userEvent.click(el_arrow_back);

        expect(onClick).toHaveBeenCalled();
    });
});
