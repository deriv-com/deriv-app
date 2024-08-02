import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarouselHeader from '../carousel-header';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    LabelPairedArrowLeftMdRegularIcon: jest.fn(({ onClick }) => (
        <button onClick={onClick}>LabelPairedArrowLeftMdRegularIcon</button>
    )),
    LabelPairedCircleInfoMdRegularIcon: jest.fn(({ onClick }) => (
        <button onClick={onClick}>LabelPairedCircleInfoMdRegularIcon</button>
    )),
}));

const mock_props = {
    current_index: 0,
    onNextClick: jest.fn(),
    onPrevClick: jest.fn(),
    title: <div>Title</div>,
};

describe('CarouselHeader', () => {
    it('should render passed title and correct icon for passed index. If user clicks on info icon, onNextClick should be called', () => {
        render(<CarouselHeader {...mock_props} />);

        expect(screen.getByText('Title')).toBeInTheDocument();

        const info_icon = screen.getByText('LabelPairedCircleInfoMdRegularIcon');
        expect(info_icon).toBeInTheDocument();

        expect(mock_props.onNextClick).not.toBeCalled();
        userEvent.click(info_icon);
        expect(mock_props.onNextClick).toBeCalled();
    });

    it('should render correct icon for passed index. If user clicks on arrow icon, onPrevClick should be called', () => {
        render(<CarouselHeader {...mock_props} current_index={1} />);

        const arrow_icon = screen.getByText('LabelPairedArrowLeftMdRegularIcon');
        expect(arrow_icon).toBeInTheDocument();

        expect(mock_props.onPrevClick).not.toBeCalled();
        userEvent.click(arrow_icon);
        expect(mock_props.onPrevClick).toBeCalled();
    });
});
