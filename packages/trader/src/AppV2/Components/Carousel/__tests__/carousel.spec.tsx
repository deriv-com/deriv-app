import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../carousel';

const data_test_id = 'dt_page';
const mock_pages = [
    {
        id: 1,
        component: (onNextClick: () => void) => (
            <button onClick={onNextClick} data-testid={data_test_id}>
                Next
            </button>
        ),
    },
    {
        id: 2,
        component: (onPrevClick: () => void) => (
            <button onClick={onPrevClick} data-testid={data_test_id}>
                Previous
            </button>
        ),
    },
];

describe('Carousel', () => {
    it('should render all passed pages', () => {
        render(<Carousel pages={mock_pages} />);

        expect(screen.getAllByTestId(data_test_id)).toHaveLength(mock_pages.length);
    });

    it('should set index to 1 if user clicks on "Next"', () => {
        const mockSetCurrentIndex = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [0, mockSetCurrentIndex]);
        render(<Carousel pages={mock_pages} />);

        userEvent.click(screen.getByText('Next'));
        expect(mockSetCurrentIndex).toBeCalledWith(1);
    });

    it('should set index to 0 if user clicks on "Previous"', () => {
        const mockSetCurrentIndex = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [1, mockSetCurrentIndex]);
        render(<Carousel pages={mock_pages} />);

        userEvent.click(screen.getByText('Previous'));

        expect(mockSetCurrentIndex).toBeCalledWith(0);
    });

    it('should set index to 0 if should_reset_carousel is true', () => {
        const mockSetCurrentIndex = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [1, mockSetCurrentIndex]);
        render(<Carousel pages={mock_pages} should_reset_carousel />);

        expect(mockSetCurrentIndex).toBeCalledWith(0);
    });
});
