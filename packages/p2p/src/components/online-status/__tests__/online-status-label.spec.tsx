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
    it('renders component with default state', () => {
        render(<OnlineStatusLabel {...props} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('renders component with default state in responsive view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<OnlineStatusLabel {...props} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is given', () => {
        const newprops = { ...props, is_online: 1 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Online')).toBeInTheDocument();
    });
    it('renders component with when no last online is in hours', () => {
        mock_value = moment('2023-05-30T18:48:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 3 hours ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is 1 hour', () => {
        mock_value = moment('2023-05-30T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 hour ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is 1 day', () => {
        mock_value = moment('2023-05-31T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 day ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is in days', () => {
        mock_value = moment('2023-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 3 days ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is in years', () => {
        mock_value = moment('2025-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is in months', () => {
        mock_value = moment('2023-11-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 5 months ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is more than 6 months', () => {
        mock_value = moment('2024-01-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is 1 month', () => {
        mock_value = moment('2023-07-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 month ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is 1 minute', () => {
        mock_value = moment('2023-05-30T15:41:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 1 minute ago')).toBeInTheDocument();
    });
    it('renders component with when no last online is in minutes', () => {
        mock_value = moment('2023-05-30T15:42:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        const newprops = { ...props, last_online_time: 1685446791 };
        render(<OnlineStatusLabel {...newprops} />);

        expect(screen.getByText('Seen 2 minutes ago')).toBeInTheDocument();
    });
});
