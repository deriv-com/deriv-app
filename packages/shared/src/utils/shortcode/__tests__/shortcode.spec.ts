import { hasForwardContractStarted } from '../shortcode';

describe('hasForwardContractStarted', () => {
    it('should return true if start_time from shortcode is less then current time', () => {
        expect(hasForwardContractStarted('CALL_1HZ10V_19.54_1710485400F_1710486300_S0P_0')).toBe(true);
    });
    it('should return false if start_time from shortcode is more then current time', () => {
        const shortcode = `CALL_1HZ10V_19.54_${Math.floor(Date.now() / 1000) + 100}F_1710486300_S0P_0`;
        expect(hasForwardContractStarted(shortcode)).toBe(false);
    });
});
