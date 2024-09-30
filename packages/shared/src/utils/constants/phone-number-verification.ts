import dayjs from 'dayjs';

export const VERIFICATION_SERVICES = {
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
} as const;

export const shouldShowPhoneVerificationNotification = (nextAttemptTimestamp: number, current_time: dayjs.Dayjs) => {
    const request_in_milliseconds = dayjs(nextAttemptTimestamp * 1000);
    const seconds_until_next_attempt = Math.round(request_in_milliseconds.diff(current_time) / 1000);

    return seconds_until_next_attempt > 0;
};
