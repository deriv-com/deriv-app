import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../carousel';

const data_test_id = 'dt_page';
const mock_pages = [
    {
        id: 1,
        component: <button data-testid={data_test_id}>Mock Content 1</button>,
    },
    {
        id: 2,
        component: <button data-testid={data_test_id}>Mock Content 2</button>,
    },
];

const MockHeader: React.ComponentProps<typeof Carousel>['CarouselHeader'] = ({
    current_index,
    onNextClick,
    onPrevClick,
}) => (
    <React.Fragment>
        <div>Current Index: {current_index}</div>
        <button onClick={onNextClick}>Next</button>
        <button onClick={onPrevClick}>Previous</button>
    </React.Fragment>
);

const mock_props = {
    pages: mock_pages,
    CarouselHeader: MockHeader,
};

describe('Carousel', () => {
    it('should render all passed pages', () => {
        render(<Carousel {...mock_props} />);

        expect(screen.getAllByTestId(data_test_id)).toHaveLength(mock_pages.length);
    });

    it('should set index to 1 if user clicks on "Next"', () => {
        const mockSetCurrentIndex = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [0, mockSetCurrentIndex]);
        render(<Carousel {...mock_props} />);

        userEvent.click(screen.getByText('Next'));
        expect(mockSetCurrentIndex).toBeCalledWith(1);
    });

    it('should set index to 0 if user clicks on "Previous"', () => {
        const mockSetCurrentIndex = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [1, mockSetCurrentIndex]);
        render(<Carousel {...mock_props} />);

        userEvent.click(screen.getByText('Previous'));

        expect(mockSetCurrentIndex).toBeCalledWith(0);
    });
});
