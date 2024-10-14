import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../carousel';
import { useSwipeable } from 'react-swipeable';

jest.mock('react-swipeable', () => ({
    useSwipeable: jest.fn(() => ({
        onMouseDown: jest.fn(),
    })),
}));
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

const MockHeader: React.ComponentProps<typeof Carousel>['header'] = ({ current_index, onNextClick, onPrevClick }) => (
    <React.Fragment>
        <div>Current Index: {current_index}</div>
        <button onClick={onNextClick}>Next</button>
        <button onClick={onPrevClick}>Previous</button>
    </React.Fragment>
);

const mock_props = {
    pages: mock_pages,
    header: MockHeader,
};

describe('Carousel', () => {
    it('should render all passed pages', () => {
        render(<Carousel {...mock_props} />);
        expect(screen.getAllByTestId(data_test_id)).toHaveLength(mock_pages.length);
    });

    it('renders without passed header component', () => {
        render(<Carousel {...mock_props} header={undefined} />);
        expect(screen.getAllByTestId(data_test_id)).toHaveLength(mock_pages.length);
    });

    it('calls useSwipeable returned function if is_swipeable === true', () => {
        const onMouseDown = jest.fn();
        (useSwipeable as jest.Mock).mockReturnValueOnce({ onMouseDown });
        render(<Carousel {...mock_props} is_swipeable={true} />);

        // there is no mouseDown event in userEvent, hence using fireEvent
        fireEvent.mouseDown(screen.getByTestId('dt_carousel'));
        expect(onMouseDown).toBeCalled();
    });

    it('should set index to 1 if user clicks on "Next"', async () => {
        render(<Carousel {...mock_props} />);
        userEvent.click(screen.getByText('Next'));
        await screen.findByText('Current Index: 1');
    });

    it('should set index to 0 if user clicks on "Previous"', async () => {
        render(<Carousel {...mock_props} />);
        userEvent.click(screen.getByText('Next'));
        userEvent.click(screen.getByText('Previous'));
        await screen.findByText('Current Index: 0');
    });

    it('should handle controlled component behavior', () => {
        const setCurrentIndex = jest.fn();
        render(<Carousel {...mock_props} current_index={0} setCurrentIndex={setCurrentIndex} />);

        userEvent.click(screen.getByText('Next'));
        expect(setCurrentIndex).toHaveBeenCalledWith(1);

        userEvent.click(screen.getByText('Previous'));
        expect(setCurrentIndex).toHaveBeenCalledWith(mock_pages.length - 1);
    });

    it('should cycle through pages correctly', async () => {
        render(<Carousel {...mock_props} />);

        userEvent.click(screen.getByText('Next'));
        await screen.findByText('Current Index: 1');

        userEvent.click(screen.getByText('Next'));
        await screen.findByText('Current Index: 0');

        userEvent.click(screen.getByText('Previous'));
        await screen.findByText('Current Index: 1');
    });

    it('should call setCurrentIndex if provided on next click', () => {
        const setCurrentIndex = jest.fn();
        render(<Carousel {...mock_props} current_index={0} setCurrentIndex={setCurrentIndex} />);
        userEvent.click(screen.getByText('Next'));
        expect(setCurrentIndex).toHaveBeenCalledWith(1);
    });

    it('should call setCurrentIndex if provided on previous click', () => {
        const setCurrentIndex = jest.fn();
        render(<Carousel {...mock_props} current_index={1} setCurrentIndex={setCurrentIndex} />);
        userEvent.click(screen.getByText('Previous'));
        expect(setCurrentIndex).toHaveBeenCalledWith(0);
    });

    it('should wrap around to the first page when clicking next on the last page', () => {
        render(<Carousel {...mock_props} />);
        userEvent.click(screen.getByText('Next'));
        userEvent.click(screen.getByText('Next'));
        expect(screen.getByText('Current Index: 0')).toBeInTheDocument();
    });

    it('should wrap around to the last page when clicking previous on the first page', () => {
        render(<Carousel {...mock_props} />);
        userEvent.click(screen.getByText('Previous'));
        expect(screen.getByText('Current Index: 1')).toBeInTheDocument();
    });
});
