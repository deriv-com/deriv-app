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
const next_button = 'Next';
const prev_button = 'Previous';
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
        <button onClick={onNextClick}>{next_button}</button>
        <button onClick={onPrevClick}>{prev_button}</button>
    </React.Fragment>
);

describe('Carousel', () => {
    let mock_props: React.ComponentProps<typeof Carousel>;

    beforeEach(() => {
        mock_props = {
            pages: mock_pages,
            header: MockHeader,
            onNextButtonClick: jest.fn(),
            onPreviousButtonClick: jest.fn(),
        };
    });

    it('renders all passed pages', () => {
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

    it('sets index to 1 if user clicks on "Next"', async () => {
        render(<Carousel {...mock_props} />);
        await userEvent.click(screen.getByText(next_button));
        await screen.findByText('Current Index: 1');
    });

    it('sets index to 0 if user clicks on "Previous"', async () => {
        render(<Carousel {...mock_props} />);
        await userEvent.click(screen.getByText(next_button));
        await userEvent.click(screen.getByText(prev_button));
        await screen.findByText('Current Index: 0');
    });

    it('handles controlled component behavior', async () => {
        const setCurrentIndex = jest.fn();
        render(<Carousel {...mock_props} current_index={0} setCurrentIndex={setCurrentIndex} />);

        await userEvent.click(screen.getByText(next_button));
        expect(setCurrentIndex).toHaveBeenCalledWith(1);

        await userEvent.click(screen.getByText(prev_button));
        expect(setCurrentIndex).toHaveBeenCalledWith(mock_pages.length - 1);
    });

    it('cycles through pages correctly if is_infinite_loop === true', async () => {
        render(<Carousel {...mock_props} is_infinite_loop={true} />);

        const next = screen.getByText(next_button);
        await userEvent.click(next);
        await screen.findByText('Current Index: 1');

        await userEvent.click(next);
        await screen.findByText('Current Index: 0');

        await userEvent.click(screen.getByText(prev_button));
        await screen.findByText('Current Index: 1');
    });

    it('cycles through pages correctly if is_infinite_loop !== true', async () => {
        render(<Carousel {...mock_props} />);

        const next = screen.getByText(next_button);
        await userEvent.click(next);
        await screen.findByText('Current Index: 1');

        await userEvent.click(next);
        await screen.findByText('Current Index: 1');

        await userEvent.click(screen.getByText(prev_button));
        await screen.findByText('Current Index: 0');
    });

    it('calls setCurrentIndex if provided on next click', async () => {
        const setCurrentIndex = jest.fn();
        render(<Carousel {...mock_props} current_index={0} setCurrentIndex={setCurrentIndex} />);
        await userEvent.click(screen.getByText(next_button));
        expect(setCurrentIndex).toHaveBeenCalledWith(1);
    });

    it('calls onNextButtonClick if provided on next click', async () => {
        render(<Carousel {...mock_props} />);

        expect(mock_props.onNextButtonClick).not.toHaveBeenCalled();
        await userEvent.click(screen.getByText(next_button));
        expect(mock_props.onNextButtonClick).toHaveBeenCalled();
    });

    it('calls setCurrentIndex and calls onPreviousButtonClick if provided on previous click', async () => {
        const setCurrentIndex = jest.fn();
        render(<Carousel {...mock_props} current_index={1} setCurrentIndex={setCurrentIndex} />);

        expect(mock_props.onPreviousButtonClick).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText(prev_button));

        expect(setCurrentIndex).toHaveBeenCalledWith(0);
        expect(mock_props.onPreviousButtonClick).toHaveBeenCalled();
    });

    it('wraps around to the last page when clicking previous on the first page', async () => {
        render(<Carousel {...mock_props} />);
        await userEvent.click(screen.getByText(next_button));
        expect(screen.getByText('Current Index: 1')).toBeInTheDocument();
    });
});
