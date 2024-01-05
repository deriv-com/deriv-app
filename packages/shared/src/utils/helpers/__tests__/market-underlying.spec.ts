import { getContractDurationType, getMarketInformation, getMarketName, getTradeTypeName } from '../market-underlying';
import { CONTRACT_TYPES, TRADE_TYPES } from '../../contract';

describe('market-underlying', () => {
    const position = {
        contract_type: 'CALL',
        shortcode: 'CALL_1HZ100V_19.53_1695913929_5T_S0P_0',
    };
    describe('getContractDurationType', () => {
        it('should return Ticks if longcode contains ticks', () => {
            expect(getContractDurationType('... ticks')).toBe('Ticks');
        });
        it('should return Days when longcode does not contain duration and shortcode is not passed', () => {
            expect(getContractDurationType('')).toBe('Days');
        });
        it('should return Days when longcode does not contain duration and shortcode is not for Multipliers', () => {
            expect(getContractDurationType('', position.shortcode)).toBe('Days');
        });
        it('should return an empty string when shortcode is for Multipliers', () => {
            expect(getContractDurationType('', 'MULTUP_1HZ100V_10.00_10_1702912846_4856543999_0_0.00')).toBe('');
        });
        it('should return a plural duration if longcode contains singular duration', () => {
            expect(
                getContractDurationType(
                    'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 1 minute after contract start time.'
                )
            ).toBe('Minutes');
        });
    });
    describe('getMarketInformation', () => {
        it('should return an object with correct data about contract_type and symbol when shortcode is provided', () => {
            expect(getMarketInformation(position.shortcode)).toMatchObject({ category: 'call', underlying: '1HZ100V' });
        });
        it('should return an object with empty values when shortcode is not provided', () => {
            expect(getMarketInformation('')).toMatchObject({ category: '', underlying: '' });
        });
    });
    describe('getMarketName', () => {
        it('should return the correct symbol display name when symbol is provided', () => {
            expect(getMarketName('R_100')).toBe('Volatility 100 Index');
        });
        it('should return null when symbol is not provided', () => {
            expect(getMarketName('')).toBe(null);
        });
    });
    describe('getTradeTypeName', () => {
        it('should return the correct contract type display name', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.ACCUMULATOR)).toBe('Accumulators');
        });
        it('should return the correct Higher or Lower contract type display name when is_how_low === true', () => {
            expect(getTradeTypeName(position.contract_type, true)).toBe('Higher');
            expect(getTradeTypeName(CONTRACT_TYPES.PUT, true)).toBe('Lower');
        });
        it('should return the correct Rise or Fall contract type display name when is_how_low === false', () => {
            expect(getTradeTypeName(position.contract_type)).toBe('Rise');
            expect(getTradeTypeName(CONTRACT_TYPES.PUT)).toBe('Fall');
        });
        it('should return the correct Long or Short contract type display name when show_button_name is true', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.LONG, false, true)).toBe('Long');
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.SHORT, false, true)).toBe('Short');
        });
        it('should return Turbos for both Turbos contract types when show_button_name is false', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.LONG)).toBe('Turbos');
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.SHORT)).toBe('Turbos');
        });
        it('should return null if an incorrect contract_type is provided', () => {
            expect(getTradeTypeName(TRADE_TYPES.RISE_FALL)).toBe(null);
        });
    });
});
