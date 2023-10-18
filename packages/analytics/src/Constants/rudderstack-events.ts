export const getRudderstackConfig = () => ({
    action_names: {
        choose_report_type: 'choose_report_type',
        close: 'close',
        close_contract: 'close_contract',
        filter_dates: 'filter_dates',
        filter_growth_rate: 'filter_growth_rate',
        filter_trade_type: 'filter_trade_type',
        filter_transaction_type: 'filter_transaction_type',
        open_contract_details: 'open_contract_details',
        open: 'open',
    },
    event_names: {
        chart_types: 'ce_chart_types_form',
        drawing_tools: 'ce_drawing_tools_form',
        indicators_types: 'ce_indicators_types_form',
        market_types: 'ce_market_types_form',
        recent_positions: 'ce_recent_positions_form',
        reports: 'ce_reports_form',
        template: 'ce_template_form',
        trade_types: 'ce_trade_types_form',
    } ,
    form_names: {
        default: 'default',
    },
    form_sources: {
        deriv_trader: 'deriv_trader',
        other: 'other',
    },
    subform_names: {
        contract_details: 'contract_details_form',
        open_positions: 'open_positions_form',
        statement: 'statement_form',
        trade_table: 'trade_table_form',
    },
} as const);