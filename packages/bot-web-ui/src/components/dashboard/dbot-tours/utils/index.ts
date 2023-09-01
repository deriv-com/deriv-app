import { CallBackProps } from 'react-joyride';
import { getSetting, storeSetting } from 'Utils/settings';

type TTourStatus = {
    key: string;
    toggle: string;
    type: string;
};

export const tour_type: TTourType = {
    key: 'onboard_tour',
};

export const tour_status_ended: TTourStatus = {
    key: '',
    toggle: '',
    type: `${tour_type.key}_status`,
};

let tour: { [key: string]: string } = {};
let current_target: number | undefined;

export const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status } = data;
    if (status === 'finished') {
        tour_status_ended.key = status;
    }
    if (action === 'close') {
        tour_status_ended.toggle = action;
    }
    if (current_target !== index) {
        tour = {};
        tour.status = status;
        tour.action = action;
    }
    current_target = index;
    setTourSettings(tour, 'tour');
    //added trigger to create new listner on local storage
    window.dispatchEvent(new Event('storage'));
    setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
};

export type TTourType = Pick<TTourStatus, 'key'>;

export const setTourType = (param: string) => {
    tour_type.key = param;
};

export const highlightLoadModalButton = (tour_active: boolean, step: number) => {
    const el_ref = document.querySelector('.toolbar__group-btn svg:nth-child(2)');
    if (tour_active && step === 1) {
        el_ref?.classList.add('dbot-tour-blink');
    } else {
        el_ref?.classList.remove('dbot-tour-blink');
    }
};

export const setTourSettings = (param: number | { [key: string]: string }, type: string) => {
    if (type === `${tour_type.key}_token`) {
        return storeSetting(`${tour_type.key}_token`, param);
    }
    return storeSetting(`${tour_type.key}_status`, param);
};

export const getTourSettings = (type: string) => {
    if (type === 'token') {
        return getSetting(`${tour_type.key}_token`);
    }
    return getSetting(`${tour_type.key}_status`);
};
