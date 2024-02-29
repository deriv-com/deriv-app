import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArrowButton from '../arrow-button';

const mockedTitle = 'mocked title';

const mockedDefaultProps = {
    is_collapsed: false,
    position: 'top' as React.ComponentProps<typeof ArrowButton>['position'],
    onClick: jest.fn(),
    title: mockedTitle,
    handle_button: false,
};

describe('<ArrowButton/>', () => {
    it('should render icon with title for top position if title is defined', () => {
        render(<ArrowButton {...mockedDefaultProps} />);

        expect(screen.getByText(mockedTitle)).toBeInTheDocument();
    });

    it('should not render icon with title for top position if title is undefined', () => {
        render(<ArrowButton {...mockedDefaultProps} title={undefined} />);

        expect(screen.queryByText(mockedTitle)).not.toBeInTheDocument();
    });

    it('should render icon with title for bottom position if title is defined', () => {
        render(<ArrowButton {...mockedDefaultProps} position='bottom' />);

        expect(screen.getByText(mockedTitle)).toBeInTheDocument();
    });

    it('should not render icon with title for bottom position if title is undefined', () => {
        render(<ArrowButton {...mockedDefaultProps} title={undefined} position='bottom' />);

        expect(screen.queryByText(mockedTitle)).not.toBeInTheDocument();
    });

    it('should render icon_flat with if handle_button === true', () => {
        render(<ArrowButton {...mockedDefaultProps} handle_button />);

        expect(screen.getByTestId('icon_handle')).toBeInTheDocument();
    });

    it('should call onClick function if user clicks on icon', () => {
        render(<ArrowButton {...mockedDefaultProps} />);
        userEvent.click(screen.getByText(mockedTitle));

        expect(mockedDefaultProps.onClick).toHaveBeenCalled();
    });

    it('should not render handle button if show_collapsible_button is false', () => {
        render(<ArrowButton {...mockedDefaultProps} show_collapsible_button={false} />);

        expect(screen.queryByTestId('icon_handle')).not.toBeInTheDocument();
    });
});
