import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaItem from '../media-item';
import { MediaHeading, MediaDescription, MediaIcon } from 'App/Components/Elements/Media';

const test_children = 'Test Children';
const test_disabled = 'Interval Duration Disabled Light Icon';
const test_enabled = 'Interval Duration Enabled Light Icon';
const mock_props = {
    disabled: jest.fn(() => <div>{test_disabled}</div>),
    enabled: jest.fn(() => <div>{test_enabled}</div>),
    id: 'test_id',
    is_enabled: true,
};

describe('MediaItem', () => {
    it('should render children inside of proper MediaItem div container with className', () => {
        render(<MediaItem>{test_children}</MediaItem>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media');
    });
});

describe('MediaHeading', () => {
    it('should render children inside of proper MediaHeading div container with className', () => {
        render(<MediaHeading>{test_children}</MediaHeading>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media__heading');
    });
});

describe('MediaDescription', () => {
    it('should render children inside of proper MediaDescription div container with className', () => {
        render(<MediaDescription>{test_children}</MediaDescription>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media__description');
    });
});

describe('MediaIcon', () => {
    it('should render MediaIcon component with enabled SVG if is_enabled === true', () => {
        render(<MediaIcon {...mock_props} />);

        expect(screen.getByText(test_enabled)).toBeInTheDocument();
    });
    it('should render MediaIcon component with disabled SVG if is_enabled === false', () => {
        render(<MediaIcon {...mock_props} is_enabled={false} />);

        expect(screen.getByText(test_disabled)).toBeInTheDocument();
    });
});
