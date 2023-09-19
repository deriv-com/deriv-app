import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import { getLastOnlineLabel } from 'Utils/adverts';
import OnlineStatusLabel from '../online-status-label';

const mock_value: moment.Moment = moment();
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    toMoment: jest.fn(() => mock_value),
    isMobile: jest.fn(() => false),
}));

jest.mock('Utils/adverts', () => ({
    ...jest.requireActual('Utils/adverts'),
    getLastOnlineLabel: jest.fn().mockReturnValue('Seen 2 days ago'),
}));

describe('<OnlineStatusLabel/>', () => {
    it('should call the getLastOnlineLabel function with is_online and last_online_time', () => {
        render(<OnlineStatusLabel is_online={0} last_online_time={1685446791} />);
        expect(getLastOnlineLabel).toHaveBeenCalledWith(0, 1685446791);
    });
});
