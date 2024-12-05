import React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
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
    LabelPairedPresentationScreenSmRegularIcon: jest.fn(({ onClick }) => (
        <button onClick={onClick}>LabelPairedPresentationScreenSmRegularIcon</button>
    )),
}));

const mock_props = {
    current_index: 0,
    onNextClick: jest.fn(),
    onPrevClick: jest.fn(),
    title: <div>Title</div>,
};

describe('CarouselHeader', () => {
    it('renders passed title and correct icon for passed index. If user clicks on info icon, onNextClick should be called', async () => {
        render(<CarouselHeader {...mock_props} />);

        expect(screen.getByText('Title')).toBeInTheDocument();

        const info_icon = screen.getByText('LabelPairedCircleInfoMdRegularIcon');
        expect(info_icon).toBeInTheDocument();

        expect(mock_props.onNextClick).not.toBeCalled();
        await userEvent.click(info_icon);
        expect(mock_props.onNextClick).toBeCalled();
    });

    it('renders correct icon for passed index. If user clicks on arrow icon, onPrevClick should be called', async () => {
        render(<CarouselHeader {...mock_props} current_index={1} />);

        const arrow_icon = screen.getByText('LabelPairedArrowLeftMdRegularIcon');
        expect(arrow_icon).toBeInTheDocument();

        expect(mock_props.onPrevClick).not.toBeCalled();
        await userEvent.click(arrow_icon);
        expect(mock_props.onPrevClick).toBeCalled();
    });

    it('renders custom icon instead of the default one if previous_icon or next_icon were passed', () => {
        render(<CarouselHeader {...mock_props} next_icon={LabelPairedPresentationScreenSmRegularIcon} />);

        const custom_icon = screen.getByText('LabelPairedPresentationScreenSmRegularIcon');
        expect(custom_icon).toBeInTheDocument();

        const default_icon = screen.queryByText('LabelPairedCircleInfoMdRegularIcon');
        expect(default_icon).not.toBeInTheDocument();
    });
});
