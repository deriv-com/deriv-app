import ServerTime from '_common/base/server_time';

export const isCancellationExpired = contract_info =>
    !!(contract_info.cancellation.date_expiry < ServerTime.get().unix());
