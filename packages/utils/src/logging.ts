import { datadogRum } from '@datadog/browser-rum';

export type TLogData = Record<string, unknown>;

export const logError = (message: string, data: TLogData = {}): void => {
    const payload = { message, ...data };
    if (window.TrackJS?.track) {
        window.TrackJS.track(payload);
    }
    if (typeof datadogRum?.addError === 'function') {
        datadogRum.addError(message, { extra: data });
    } else if (window.DD_RUM && typeof (window.DD_RUM as any).addError === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.DD_RUM as any).addError(message, { extra: data });
    }
};
