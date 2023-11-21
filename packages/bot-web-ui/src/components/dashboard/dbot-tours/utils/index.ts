import { storeSetting } from 'Utils/settings';

type TTourStatus = {
    key: string;
    toggle: string;
    type: string;
};

type TTourList = {
    [key: number]: string;
};

export const tour_type: TTourType = {
    key: 'onboard_tour',
};

export const tour_status_ended: TTourStatus = {
    key: '',
    toggle: '',
    type: `${tour_type.key}_status`,
};

export type TTourType = Pick<TTourStatus, 'key'>;

export const setTourType = (param: string) => {
    tour_type.key = param;
};

export const highlightLoadModalButton = (tour_active: string, step: number) => {
    const el_ref = document.querySelector('.toolbar__group-btn svg:nth-child(2)');
    if (tour_active && step === 1) {
        el_ref?.classList.add('dbot-tour-blink');
    } else {
        el_ref?.classList.remove('dbot-tour-blink');
    }
};

export const setTourSettings = (param: number, type: string) => {
    return storeSetting(type, param);
};

export const tour_list: TTourList = Object.freeze({
    0: 'onboarding',
    1: 'bot_builder',
});
