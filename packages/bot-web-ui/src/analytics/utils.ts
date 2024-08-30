import { STRATEGIES } from '../pages/bot-builder/quick-strategy/config';
import { STORED_ITEM_NOT_FOUND, TFormStrategy } from './constants';

export const rudderstack_text_error = 'Rudderstack: unable to get dropdown text';

export const getRsDropdownTextFromLocalStorage = () => {
    try {
        return JSON.parse(localStorage?.getItem('qs-analytics') ?? '{}');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(rudderstack_text_error);
        return {};
    }
};

const hasStoredText = (parameter: string) => parameter && parameter !== STORED_ITEM_NOT_FOUND;

export const getRsStrategyType = (selected_strategy: string) => STRATEGIES[selected_strategy]?.rs_strategy_name;

export const getQsActiveTabString = (tab: string) => (tab === 'TRADE_PARAMETERS' ? 'trade parameters' : 'learn more');

enum LOAD_MODAL_TABS_VALUE {
    recent = 'recent',
    local = 'local',
    google_drive = 'google drive',
}
export const LOAD_MODAL_TABS = Object.values(LOAD_MODAL_TABS_VALUE);

export const getTradeParameterData = ({ form_values }: TFormStrategy) => {
    if (!form_values) return;

    const { symbol, tradetype, type, stake } = form_values;
    const stored_texts = getRsDropdownTextFromLocalStorage();

    return {
        asset_type: hasStoredText(stored_texts?.symbol) ? stored_texts.symbol : symbol,
        trade_type: hasStoredText(stored_texts?.tradetype) ? stored_texts?.tradetype : tradetype,
        purchase_condition: hasStoredText(stored_texts?.type) ? stored_texts?.type : type,
        initial_stake: hasStoredText(stored_texts?.stake) ? stored_texts?.stake : stake,
    };
};

export const getStrategyType = (block_string: string | ArrayBuffer) => {
    try {
        const xmlDoc = new DOMParser().parseFromString(block_string.toString(), 'application/xml');
        if (xmlDoc.getElementsByTagName('xml').length) {
            const root = xmlDoc.documentElement;
            const isDbotValue = root.getAttribute('is_dbot');
            return isDbotValue === 'true' ? 'new' : 'old';
        }
        return 'old';
    } catch (e) {
        return 'old';
    }
};
