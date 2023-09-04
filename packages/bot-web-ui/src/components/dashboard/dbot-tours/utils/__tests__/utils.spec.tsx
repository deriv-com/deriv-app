import { getSetting, storeSetting } from 'Utils/settings';
import {
    getTourSettings,
    handleJoyrideCallback,
    highlightLoadModalButton,
    setTourSettings,
    setTourType,
    tour_status_ended,
    tour_type,
} from '../index';

jest.mock('Utils/settings', () => ({
    setTourSettings: jest.fn(),
    getTourSettings: jest.fn(),
    storeSetting: jest.fn(),
    getSetting: jest.fn(),
}));

describe('Tour Functions and Handlers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('setTourType sets the tour type correctly', () => {
        setTourType('new_tour');
        expect(tour_type.key).toBe('new_tour');
    });

    it('highlightLoadModalButton adds and removes the class', () => {
        const el_ref = document.createElement('div');

        highlightLoadModalButton(true, 1);
        el_ref.classList.add('dbot-tour-blink');
        expect(el_ref).toHaveClass('dbot-tour-blink');

        highlightLoadModalButton(false, 1);
        el_ref.classList.remove('dbot-tour-blink');
        expect(el_ref).not.toHaveClass('dbot-tour-blink');
    });

    it('setTourSettings calls storeSetting with the correct arguments', () => {
        setTourSettings(12345, 'status');
        expect(storeSetting).toHaveBeenCalledTimes(1);
    });

    it('getTourSettings calls getSetting with argument if not token', () => {
        getTourSettings('status');
        expect(getSetting).toHaveBeenCalledWith(`${tour_type.key}_status`);
    });

    it('getTourSettings calls getSetting with the correct arguments token', () => {
        getTourSettings('token');
        expect(getSetting).toHaveBeenCalledWith(`${tour_type.key}_token`);
    });

    it('handleJoyrideCallback updates tour status', () => {
        const data = { status: 'finished', action: 'close', index: 1 };
        handleJoyrideCallback(data);
        expect(tour_status_ended.key).toBe('finished');
    });
});
