import { Analytics } from '@deriv-com/analytics';
import { ACTION, TFormStrategy } from '../constants';
import { rudderStackSendSwitchLoadStrategyTabEvent } from '../rudderstack-bot-builder';
import {
    rudderStackSendGoogleDriveConnectEvent,
    rudderStackSendGoogleDriveDisconnectEvent,
    rudderStackSendUploadStrategyCompletedEvent,
} from '../rudderstack-common-events';
import {
    getRsDropdownTextFromLocalStorage,
    getStrategyType,
    getTradeParameterData,
    rudderstack_text_error,
} from '../utils';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

describe('utils', () => {
    const form_strategy = {
        form_values: {
            symbol: 'BTCUSD',
            tradetype: 'CALL',
            type: 'MULT',
            stake: '100',
        },
    } as TFormStrategy;

    it('getRsDropdownTextFromLocalStorage() should return empty object when parced json of "qs-analytics" localStorage equals undefined or null', () => {
        const result = getRsDropdownTextFromLocalStorage();
        expect(result).toEqual({});
    });

    it('getRsDropdownTextFromLocalStorage() should throw an error when json is invalid', () => {
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue('invalid JSON');
        const result = getRsDropdownTextFromLocalStorage();

        expect(result).toEqual({});
        // eslint-disable-next-line no-console
        expect(console.error).toHaveBeenCalledWith(rudderstack_text_error);
    });

    it('should return form values when no stored text is available', () => {
        const result = getTradeParameterData(form_strategy);

        expect(result).toEqual({
            asset_type: 'BTCUSD',
            trade_type: 'CALL',
            purchase_condition: 'MULT',
            initial_stake: '100',
        });
    });

    it('should return stored text when available', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue(
            '{"symbol":"ETHUSD","tradetype":"PUT","type":"DIGIT","stake":200}'
        );

        const result = getTradeParameterData(form_strategy);

        expect(result).toEqual({
            asset_type: 'ETHUSD',
            trade_type: 'PUT',
            purchase_condition: 'DIGIT',
            initial_stake: 200,
        });
    });

    it('should use form value when stored text is not present for a specific field', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue('{"symbol":"ETHUSD"}');

        const result = getTradeParameterData(form_strategy);

        expect(result).toEqual({
            asset_type: 'ETHUSD',
            trade_type: 'CALL',
            purchase_condition: 'MULT',
            initial_stake: '100',
        });
    });

    it('should return "new" if the XML has is_dbot="true"', () => {
        const xml = `
            <xml is_dbot="true">
                <block></block>
            </xml>`;

        const result = getStrategyType(xml);
        expect(result).toBe('new');
    });

    it('should return "old" if the XML has is_dbot="false"', () => {
        const xml = `
            <xml is_dbot="false">
                <someElement></someElement>
            </xml>`;

        const result = getStrategyType(xml);
        expect(result).toBe('old');
    });

    it('should return "old" if the XML does not contain the is_dbot attribute', () => {
        const xml = `
            <xml>
                <block></block>
            </xml>`;
        const result = getStrategyType(xml);
        expect(result).toBe('old');
    });

    it('should return "old" for invalid XML', () => {
        const xml = `
            <xml>
                <block>
            </xml>`;

        const result = getStrategyType(xml);
        expect(result).toBe('old');
    });

    it('should return "old" if an unexpected error occurs during parsing', () => {
        global.DOMParser = jest.fn().mockImplementation(() => {
            return {
                parseFromString: () => {
                    throw new Error('Parsing error');
                },
            };
        });

        const xml = '<xml></xml>';
        const result = getStrategyType(xml);

        expect(result).toBe('old');
    });

    it('should call Analytics.trackEvent with the correct parameters', () => {
        const load_strategy = { load_strategy_tab: 'local' };

        rudderStackSendSwitchLoadStrategyTabEvent(load_strategy);

        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_bot_form', {
            action: ACTION.SWITCH_LOAD_STRATEGY_TAB,
            form_name: 'ce_bot_form',
            load_strategy_tab: load_strategy.load_strategy_tab,
            subform_name: 'load_strategy',
            subpage_name: 'bot_builder',
        });
    });

    it('should call Analytics.trackEvent with correct parameters for upload strategy completed event', () => {
        const upload_parameters = {
            upload_provider: 'my_computer',
            upload_id: '12345',
            upload_type: 'new',
        };

        rudderStackSendUploadStrategyCompletedEvent(upload_parameters);

        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_bot_form', {
            action: ACTION.UPLOAD_STRATEGY_COMPLETED,
            form_name: 'ce_bot_form',
            subform_name: 'load_strategy',
            subpage_name: 'bot_builder',
            upload_provider: upload_parameters.upload_provider,
            upload_id: upload_parameters.upload_id,
            upload_type: upload_parameters.upload_type,
        });
    });

    it('should call Analytics.trackEvent with correct parameters for Google Drive connect event', () => {
        rudderStackSendGoogleDriveConnectEvent();

        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_bot_form', {
            action: ACTION.GOOGLE_DRIVE_CONNECT,
            form_name: 'ce_bot_form',
            subpage_name: 'bot_builder',
        });
    });

    it('should call Analytics.trackEvent with correct parameters for Google Drive disconnect event', () => {
        rudderStackSendGoogleDriveDisconnectEvent();

        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_bot_form', {
            action: ACTION.GOOGLE_DRIVE_DISCONNECT,
            form_name: 'ce_bot_form',
            subpage_name: 'bot_builder',
        });
    });
});
