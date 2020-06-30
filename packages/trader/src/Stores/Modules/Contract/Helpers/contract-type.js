export const isCallPut = trade_type =>
    trade_type === 'rise_fall' || trade_type === 'rise_fall_equal' || trade_type === 'high_low';
