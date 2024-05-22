import dayjs, { OpUnitType } from 'dayjs';

export type CommonPropTypes = {
    calendar_date: dayjs.ConfigType;
    isPeriodDisabled: (date: dayjs.Dayjs, unit: OpUnitType) => boolean;
    selected_date: dayjs.ConfigType;
    updateSelected: (e: React.MouseEvent<HTMLSpanElement>, type: OpUnitType) => void;
};
