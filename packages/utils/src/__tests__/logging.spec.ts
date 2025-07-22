import { logError } from '../logging';
import { datadogRum } from '@datadog/browser-rum';

jest.mock('@datadog/browser-rum', () => ({
    datadogRum: {
        addError: jest.fn(),
    },
}));

describe('logError', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (window as any).TrackJS = undefined;
        (window as any).DD_RUM = undefined;
    });

    it('should log to TrackJS and datadog when available', () => {
        const trackSpy = jest.fn();
        (window as any).TrackJS = { track: trackSpy };
        (datadogRum.addError as jest.Mock).mockImplementation(() => {});

        logError('test message', { foo: 'bar' });

        expect(trackSpy).toHaveBeenCalledWith({ message: 'test message', foo: 'bar' });
        expect(datadogRum.addError).toHaveBeenCalledWith('test message', { extra: { foo: 'bar' } });
    });

    it('should fallback to window.DD_RUM when datadogRum is unavailable', () => {
        const ddRumAddError = jest.fn();
        // @ts-ignore - modify mocked module
        datadogRum.addError = undefined;
        (window as any).DD_RUM = { addError: ddRumAddError };

        logError('another message');

        expect(ddRumAddError).toHaveBeenCalledWith('another message', { extra: {} });
    });

    it('should not throw if no logging clients are available', () => {
        // @ts-ignore - modify mocked module
        datadogRum.addError = undefined;

        expect(() => logError('no clients')).not.toThrow();
    });
});
