import PendingPromise from "./pending-promise";
import config         from "../../constants/const";

export default class ContractsFor {
    constructor(ws, server_time) {
        this.cache_age_in_min          = 0;
        this.contracts_for             = {};
        // Below you can disable specific trade types and trade type categories, you may specify
        // market, submarket, symbol, trade_type, and trade_type_category. If one of
        // the props is left omitted, the rule applies to each of the values of the omitted prop.
        // e.g. if market omitted, rule will apply to all markets.
        this.disabled_options      = [
            { 
                market    : 'forex', 
                submarket : 'smart_fx', 
                trade_type: 'higherlower',
            }, 
            { trade_type_category: 'callputspread' },
            { trade_type_category: 'lookback' },
        ],
        this.retrieving_contracts_for  = {};
        this.server_time               = server_time;
        this.ws                        = ws;
    }

    async getBarriers(symbol, trade_type_category, trade_type, duration, barrier_types) {
        const barriers               = { values: [] };
        const barrier_props          = ['high_barrier', 'low_barrier'];
        const contracts_for_category = await this.getContractsByCategory(symbol, trade_type_category, trade_type);
        const durations              = await this.getDurations(symbol, trade_type_category);
        const offset_regexp          = new RegExp('^[-|+]([0-9]+.[0-9]+)$')
        const isOffset               = input => input && offset_regexp.test(input.toString());
        
        if (contracts_for_category.length > 0) {
            barrier_types.forEach((barrier_type, index) => {
                const has_selected_offset_type = ['+', '-'].includes(barrier_type);
                let contract;

                contract = contracts_for_category.find(contract => {
                    const has_duration = durations.findIndex(d => d.unit === duration) !== -1;
    
                    if (has_duration) {
                        const barrierIsOffset = () => isOffset(contract.barrier || contract[barrier_props[index]]);

                        return (
                            (has_selected_offset_type && barrierIsOffset()) || 
                            (!has_selected_offset_type && !barrierIsOffset())
                        );
                    }

                    return false;
                });
                // If contract wasn't found, fallback to an absolute barrier value.
                if (!contract) {
                    contract = contracts_for_category.find(c => {
                        return !isOffset(c.barrier || c.high_barrier) && barrier_type === 'absolute';
                    });
                }
                // If for some reason we still don't have a contract, fallback to smallest available barriers.
                if (!contract) {
                    contract = contracts_for_category.sort((a, b) => {
                        return parseFloat(a.barrier || a.high_barrier) - parseFloat(b.barrier || b.high_barrier);
                    }).shift();
                }

                if (contract && !config.BARRIERLESS_TRADE_CATEGORIES.includes(contract.contract_category)) {
                    const barrier_prop_name = (contract.barriers === 1 ? 'barrier' : barrier_props[index]);
    
                    if (contract[barrier_prop_name]) {
                        const barrier_match = `${contract[barrier_prop_name]}`.match(offset_regexp);
    
                        barriers.values[index] = barrier_match ? barrier_match[1] : contract[barrier_prop_name];
                    }
    
                    barriers.allow_both_types    = ['intraday', 'tick'].includes(contract.expiry_type) && isOffset(contract[barrier_prop_name]);
                    barriers.allow_absolute_type = barrier_type === 'absolute' && !isOffset(contract[barrier_prop_name]);
                }
    
                if (contract.barriers === 1) {
                    barrier_types.splice(index + 1, 1);
                }
            });

            // Set distinct values for both barriers if they have equal values
            if (
                barriers.values.length === 2 &&
                barrier_types.every(barrier_type => barrier_type === barrier_types[0]) &&
                barriers.values.every(barrier => barrier === barriers.values[0])
            ) {
                barriers.values[1] = (barriers.values[0] * 0.95).toFixed(1);
            }
        }

        return barriers;
    }

    getConditionCategory(trade_type) {
        const { conditionsCategory: conditions_category } = config;

        return Object.keys(conditions_category).find(condition_category => {
            return condition_category === trade_type || conditions_category[condition_category].includes(trade_type)
        });
    }

    async getContractsByCategory(symbol, trade_type_category, trade_type) {
        const contracts = await this.getContractsFor(symbol);
        const { 
            barrierCategories: barrier_categories,
            conditionsCategory: conditions_category 
        } = config;
        const condition_category = Object.keys(conditions_category).find(condition_category => {
            return condition_category === trade_type_category || conditions_category[condition_category].includes(trade_type_category)
        });
        
        return contracts.filter(contract => {
            const has_matching_category = condition_category && contract.contract_category === condition_category;
            const hasMatchingBarrier = () => {
                const conditions = [];

                Object.keys(barrier_categories).forEach(barrier_category => {
                    const subcategories = barrier_categories[barrier_category];

                    if (subcategories.includes(trade_type)) {
                        conditions.push(contract.barrier_category === barrier_category);
                    }

                    return conditions.length;
                });

                return !conditions.includes(false);
            }
            const test = hasMatchingBarrier();

            return has_matching_category && test;
        });
    }

    async getContractsFor(symbol) {
        const getContractsForFromApi = async () => {
            if (this.retrieving_contracts_for[symbol]) {
                await this.retrieving_contracts_for[symbol];
                return this.contracts_for[symbol].contracts;
            } else {
                this.retrieving_contracts_for[symbol] = new PendingPromise();
            }

            const response = await this.ws.contractsFor(symbol);

            if (response.error) {
                return [];
            }

            const { contracts_for: { available: contracts } } = response;

            // We don't offer forward-starting contracts in bot.
            const filtered_contracts = contracts.filter(contract => {
                return contract.start_type !== 'forward'
            });

            this.contracts_for[symbol] = { 
                contracts: filtered_contracts, 
                timestamp: this.server_time.getEpoch()
            };

            this.retrieving_contracts_for[symbol].resolve();

            return filtered_contracts;
        }

        if (this.contracts_for[symbol]) {
            const { contracts, timestamp } = this.contracts_for[symbol];
            const is_expired = (this.server_time.getEpoch() - timestamp > this.cache_age_in_min * 60000);

            if (is_expired) {
                getContractsForFromApi();
            }

            return contracts;
        }

        return await getContractsForFromApi();
    }

    async getDurations(symbol, trade_type_category, trade_type) {
        const contracts = await this.getContractsFor(symbol);
    
        if (contracts.length === 0) {
            return config.NOT_AVAILABLE_DURATIONS;
        }

        const { DEFAULT_DURATION_DROPDOWN_OPTIONS } = config;
        const contracts_for_category = await this.getContractsByCategory(symbol, trade_type_category, trade_type);
        const durations = [];
        const getDurationIndex = input => DEFAULT_DURATION_DROPDOWN_OPTIONS.findIndex(d => d[1] === input.replace(/\d+/g, ''));
        
        contracts_for_category.forEach(contract => {
            if (!contract.min_contract_duration || !contract.max_contract_duration) {
                return;
            }

            const start_index = getDurationIndex(contract.min_contract_duration);
            const end_index   = getDurationIndex(contract.max_contract_duration === '1d' ? '24h' : contract.max_contract_duration);

            DEFAULT_DURATION_DROPDOWN_OPTIONS.slice(start_index, end_index + 1).forEach((default_duration, index) => {
                if (!durations.find(d => d.unit === default_duration[1])) {
                    durations.push({
                        display: default_duration[0],
                        unit   : default_duration[1],
                        min    : (index === 0 ? parseInt(contract.min_contract_duration.replace(/\D/g, '')) : 1),
                    });
                }
            });
        });

        // If only intraday contracts available, remove day durations
        if (contracts_for_category.every(contract => contract.expiry_type === 'intraday')) {
            const day_duration_index = durations.findIndex(d => d[1] === 'd');

            if (day_duration_index !== -1) {
                durations.splice(day_duration_index, 1);
            }
        }

        if (durations.length === 0) {
            return config.NOT_AVAILABLE_DURATIONS;
        }

        // Maintain order based on duration unit
        return durations.sort((a, b) => getDurationIndex(a.unit) - getDurationIndex(b.unit));
    }

    async getPredictionRange(symbol, trade_type_category, trade_type) {
        const contracts = await this.getContractsByCategory(symbol, trade_type_category, trade_type);
        const condition_category = this.getConditionCategory(trade_type_category);
        const prediction_range = [];

        if (config.DIGIT_CATEGORIES.includes(condition_category)) {
            const contract = contracts.find(c => {
                const categories = Object.keys(config.opposites);

                return categories.some(category => 
                    config.opposites[category]
                        .map(subcategory => Object.keys(subcategory)[0])
                        .includes(c.contract_type)
                );
            });

            if (contract && contract.last_digit_range) {
                prediction_range.push(...contract.last_digit_range);
            } else {
                prediction_range.push(1, 2, 3, 4, 5, 6, 7, 8);
            }
        }

        return prediction_range;
    }

    async getTradeTypeCategories(market, submarket, symbol) {
        const contracts = await this.getContractsFor(symbol);
        const trade_type_categories = [];
        const { conditionsCategoryName } = config;

        contracts.forEach(contract => {
            const category_name = conditionsCategoryName[contract.contract_category];

            if (category_name) {
                const is_disabled = this.isDisabledOption({ 
                    market, 
                    submarket, 
                    symbol, 
                    trade_type_category: contract.contract_category 
                });

                if (!is_disabled) {
                    const is_existing_category = trade_type_categories.findIndex(trade_type_category => 
                        trade_type_category[1] === contract.contract_category
                    ) !== -1;

                    if (!is_existing_category) {
                        trade_type_categories.push([
                            category_name,
                            contract.contract_category
                        ]);
                    }
                }
            }
        });

        return (trade_type_categories.length > 0 ? trade_type_categories : [['Not available', 'na']]);
    }

    getTradeTypes(market, submarket, symbol, trade_type_category) {
        const { conditionsCategory, opposites } = config;
        const trade_types = [];
        const subcategories = conditionsCategory[trade_type_category];

        if (subcategories) {
            subcategories.forEach(trade_type => {
                const is_disabled = this.isDisabledOption({ 
                    market, 
                    submarket, 
                    symbol, 
                    trade_type_category,
                    trade_type 
                });

                if (!is_disabled) {
                    const types = opposites[trade_type.toUpperCase()];
                    // e.g. [['Rise/Fall', 'callput']]
                    trade_types.push([types.map(type => type[Object.keys(type)[0]]).join('/'), trade_type]);
                }
            });
        }

        return trade_types;
    }

    isDisabledOption(compare_obj) {
        return this.disabled_options.some(disabled_obj => 
            Object.keys(disabled_obj).every(prop => compare_obj[prop] === disabled_obj[prop])
        );
    }
}
