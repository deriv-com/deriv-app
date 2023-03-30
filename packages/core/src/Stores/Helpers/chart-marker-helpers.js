import extend from 'extend';
import {
    formatMoney,
    getEndTime,
    isAccumulatorContract,
    isDesktop,
    isDigitContract,
    isMobile,
    isMultiplierContract,
    isUserSold,
    isVanillaContract,
} from '@deriv/shared';

import { MARKER_TYPES_CONFIG } from '../Constants/markers';

const createMarkerConfig = (marker_type, x, y, content_config) =>
    extend(true, {}, MARKER_TYPES_CONFIG[marker_type], {
        marker_config: {
            x: +x,
            y,
        },
        content_config,
    });

export const getSpotCount = (contract_info, spot_count) => {
    if (isDigitContract(contract_info.contract_type)) return spot_count + 1;
    if (isAccumulatorContract(contract_info.contract_type)) return null;
    return spot_count;
};

// -------------------- Lines --------------------
export const createMarkerEndTime = contract_info => {
    const end_time = getEndTime(contract_info);
    if (!end_time) return false;

    return createMarkerConfig(MARKER_TYPES_CONFIG.LINE_END.type, +end_time, null, {
        status: `${contract_info.profit >= 0 ? 'won' : 'lost'}`,
        marker_config: MARKER_TYPES_CONFIG,
    });
};

export const createMarkerPurchaseTime = contract_info => {
    if (
        !contract_info.purchase_time ||
        !contract_info.date_start ||
        +contract_info.purchase_time === +contract_info.date_start
    )
        return false;

    return createMarkerConfig(MARKER_TYPES_CONFIG.LINE_PURCHASE.type, +contract_info.purchase_time);
};

export const createMarkerStartTime = contract_info => {
    if (!contract_info.date_start) return false;

    return createMarkerConfig(MARKER_TYPES_CONFIG.LINE_START.type, +contract_info.date_start, null, {
        marker_config: MARKER_TYPES_CONFIG,
    });
};

// -------------------- Spots --------------------
export const createMarkerSpotEntry = contract_info => {
    if (!contract_info.entry_tick_time) return false;

    let marker_type = MARKER_TYPES_CONFIG.SPOT_ENTRY.type;
    let component_props = {};
    const entry_tick = contract_info.entry_tick_display_value;

    const spot_has_label = isDigitContract(contract_info.contract_type);

    if (spot_has_label) {
        marker_type = MARKER_TYPES_CONFIG.SPOT_MIDDLE.type;
        component_props = {
            spot_value: `${entry_tick}`,
            spot_epoch: `${contract_info.entry_tick_time}`,
            spot_count: 1,
        };
    }

    return createMarkerConfig(marker_type, contract_info.entry_tick_time, entry_tick, component_props);
};

export const createMarkerSpotExit = (contract_info, tick, idx) => {
    if (!contract_info.exit_tick_time) return false;
    const is_user_sold = isUserSold(contract_info);

    let spot_count, align_label;
    if (tick) {
        spot_count = getSpotCount(contract_info, idx);
        align_label = tick.align_label;
    }

    const exit_tick = contract_info.exit_tick_display_value;

    const should_show_spot_exit = !is_user_sold || isMultiplierContract(contract_info.contract_type);

    const should_show_profit_label = isVanillaContract(contract_info.contract_type) && isDesktop();

    const marker_spot_type = should_show_spot_exit
        ? MARKER_TYPES_CONFIG.SPOT_EXIT.type
        : MARKER_TYPES_CONFIG.SPOT_SELL.type;

    const component_props = should_show_spot_exit
        ? {
              spot_value: `${exit_tick}`,
              spot_epoch: `${contract_info.exit_tick_time}`,
              status: `${+contract_info.profit >= 0 ? 'won' : 'lost'}`,
              align_label: should_show_profit_label ? 'middle' : align_label,
              spot_count,
              spot_profit:
                  (should_show_profit_label &&
                      `${formatMoney(contract_info.currency, contract_info.profit, true)} ${contract_info.currency}`) ||
                  '',
          }
        : {};

    return createMarkerConfig(marker_spot_type, +contract_info.exit_tick_time, +exit_tick, component_props);
};

export const createMarkerSpotMiddle = (contract_info, tick, idx) => {
    const is_accumulator = isAccumulatorContract(contract_info.contract_type);
    const spot_count = getSpotCount(contract_info, idx);
    const spot = tick.tick_display_value;
    const spot_epoch = is_accumulator ? '' : `${tick.epoch}`;

    const marker_config = createMarkerConfig(MARKER_TYPES_CONFIG.SPOT_MIDDLE.type, +tick.epoch, +spot, {
        spot_value: `${spot}`,
        spot_epoch,
        align_label: tick.align_label,
        is_value_hidden: is_accumulator,
        spot_count,
    });
    marker_config.type = `${marker_config.type}_${idx}`;

    if (isMobile() && spot_count > 1) return null;
    return marker_config;
};
