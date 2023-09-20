import React from 'react';
import { render, screen } from '@testing-library/react';
import OnlineStatusLabel from '../online-status-label';
import moment from 'moment';
import 'moment/min/locales';
import { isMobile, toMoment } from '@deriv/shared';

const props = {
    is_online: 0,
    last_online_time: 0,
};

let mock_value: moment.Moment = moment();
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    toMoment: jest.fn(() => mock_value),
    isMobile: jest.fn(() => false),
}));

describe('<OnlineStatusLabel/>', () => {
    it('should render the component with default state', () => {
        render(<OnlineStatusLabel {...props} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('should render component with default state in responsive view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<OnlineStatusLabel {...props} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('should show label "Online" when "last_online_time" is not being passed', () => {
        const newprops = { ...props, is_online: 1 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Online')).toBeInTheDocument();
    });
    it('should show label "Seen 3 hours ago" when last seen is in hours', () => {
        mock_value = moment('2023-05-30T18:48:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 3 hours ago')).toBeInTheDocument();
    });
    it('should show label "Seen 1 hour ago" when user was last online 1 hour ago', () => {
        mock_value = moment('2023-05-30T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 hour ago')).toBeInTheDocument();
    });
    it('should show label "Seen 1 day ago" when user was last online 1 day ago', () => {
        mock_value = moment('2023-05-31T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 day ago')).toBeInTheDocument();
    });
    it('should show label "Seen 3 days ago" when last seen is in days', () => {
        mock_value = moment('2023-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 3 days ago')).toBeInTheDocument();
    });
    it('should show label "Seen more than 6 months ago" when last seen is in years', () => {
        mock_value = moment('2025-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('should show label "Seen 5 months ago" when last seen is in months', () => {
        mock_value = moment('2023-11-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 5 months ago')).toBeInTheDocument();
    });
    it('should show label "Seen more than 6 months ago" when user was last online more than 6 months ago', () => {
        mock_value = moment('2024-01-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('should show label "Seen 1 month ago" when user was last online 1 month ago', () => {
        mock_value = moment('2023-07-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 month ago')).toBeInTheDocument();
    });
    it('should show label "Seen 1 minute ago" when user was last online 1 minute ago', () => {
        mock_value = moment('2023-05-30T15:41:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 minute ago')).toBeInTheDocument();
    });
    it('should show label "Seen 2 minutes ago" when last seen is in minutes', () => {
        mock_value = moment('2023-05-30T15:42:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 2 minutes ago')).toBeInTheDocument();
    });
    it('should show label "Online" when last seen is in seconds', () => {
        mock_value = moment('2023-05-30T15:40:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Online')).toBeInTheDocument();
    });
});
