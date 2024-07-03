import dayjs from 'dayjs';

export const VERIFICATION_SERVICES = {
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
} as const;

export const getTimestamp = (nextAttemptTimestamp: number, current_time: dayjs.Dayjs) => {
    const request_in_milliseconds = dayjs(nextAttemptTimestamp * 1000);
    const next_request = Math.round(request_in_milliseconds.diff(current_time) / 1000);

    return next_request > 0;
};
