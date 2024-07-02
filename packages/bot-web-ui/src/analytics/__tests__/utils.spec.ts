import { DBOT_TABS } from 'Constants/bot-contents';
import { TFormStrategy } from '../constants';
import {
    getTradeParameterData,
    getRsDropdownTextFromLocalStorage,
    getSubpageName,
    rudderstack_text_error,
} from '../utils';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('utils', () => {
    const form_strategy = {
        form_values: {
            symbol: 'BTCUSD',
            tradetype: 'CALL',
            type: 'MULT',
            stake: '100',
        },
    } as TFormStrategy;

    const subpage_name = {
        [`${DBOT_TABS.DASHBOARD}`]: 'dashboard',
        [`${DBOT_TABS.BOT_BUILDER}`]: 'bot_builder',
        [`${DBOT_TABS.CHART}`]: 'charts',
        [`${DBOT_TABS.TUTORIAL}`]: 'tutorials',
    };

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

    it('getSubpageName() should "undefined" if was not pass anything', () => {
        const result = getSubpageName();

        expect(result).toEqual('undefined');
    });

    it('getSubpageName() should return "dashboard" active_tab equals 0', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue(`${DBOT_TABS.DASHBOARD}`);

        const result = getSubpageName();

        expect(result).toEqual(subpage_name[`${DBOT_TABS.DASHBOARD}`]);
    });

    it('getSubpageName() should return "bot_builder" active_tab equals 1', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue(`${DBOT_TABS.BOT_BUILDER}`);

        const result = getSubpageName();

        expect(result).toEqual(subpage_name[`${DBOT_TABS.BOT_BUILDER}`]);
    });

    it('getSubpageName() should return "charts" active_tab equals 2', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue(`${DBOT_TABS.CHART}`);

        const result = getSubpageName();

        expect(result).toEqual(subpage_name[`${DBOT_TABS.CHART}`]);
    });

    it('getSubpageName() should return "tutorials" active_tab equals 3', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue(`${DBOT_TABS.TUTORIAL}`);

        const result = getSubpageName();

        expect(result).toEqual(subpage_name[`${DBOT_TABS.TUTORIAL}`]);
    });
});
