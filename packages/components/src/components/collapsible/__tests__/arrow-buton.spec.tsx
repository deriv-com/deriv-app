import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArrowButton from '../arrow-button';

const mocked_title = 'mocked_title';

const mocked_default_props = {
    is_collapsed: false,
    position: 'top' as React.ComponentProps<typeof ArrowButton>['position'],
    onClick: jest.fn(),
    title: 'mocked_title',
    handle_button: false,
};

describe('<ArrowButton/>', () => {
    it('should render icon with title for top position if title is defined', () => {
        render(<ArrowButton {...mocked_default_props} />);

        expect(screen.getByText(mocked_title)).toBeInTheDocument();
    });

    it('should not render icon with title for top position if title is undefined', () => {
        render(<ArrowButton {...mocked_default_props} title={undefined} />);

        expect(screen.queryByText(mocked_title)).not.toBeInTheDocument();
    });

    it('should render icon with title for bottom position if title is defined', () => {
        render(<ArrowButton {...mocked_default_props} position='bottom' />);

        expect(screen.getByText(mocked_title)).toBeInTheDocument();
    });

    it('should not render icon with title for bottom position if title is undefined', () => {
        render(<ArrowButton {...mocked_default_props} title={undefined} position='bottom' />);

        expect(screen.queryByText(mocked_title)).not.toBeInTheDocument();
    });

    it('should render icon_flat with if handle_button === true', () => {
        render(<ArrowButton {...mocked_default_props} handle_button />);

        expect(screen.getByTestId('icon_flat')).toBeInTheDocument();
    });

    it('should call onClick function if user clicks on icon', () => {
        render(<ArrowButton {...mocked_default_props} />);
        userEvent.click(screen.getByText(mocked_title));

        expect(mocked_default_props.onClick).toHaveBeenCalled();
    });
});
