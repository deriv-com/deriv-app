import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { TTradeStore } from 'Types';

type TOnChangeContractTypeList = (store: TTradeStore) => {
    contract_type: string | number;
};

type TContractValues = Pick<
    TTradeStore,
    | 'form_components'
    | 'basis_list'
    | 'duration_units_list'
    | 'expiry_type'
    | 'accumulator_range_list'
    | 'cancellation_range_list'
> & {
    basis: string | number;
    trade_types: string[];
    start_date: number;
    start_dates_list: (
        | {
              text: string;
              value: number;
          }
        | {
              text: string;
              value: number;
              sessions: {
                  open: moment.Moment;
                  close: moment.Moment;
              }[];
          }
    )[];
    contract_start_type: string;
    barrier_count: number;
    barrier_1: string;
    barrier_2: string;
    duration_unit: string | number;
    duration_min_max:
        | {
              [key: string]: {
                  min: number;
                  max: number;
              };
          }
        | {
              min: number;
              max: number;
          };
    multiplier_range_list: {
        text: string;
        value: number;
    }[];
    multiplier: string | number;
};

export const onChangeContractTypeList: TOnChangeContractTypeList = ({ contract_types_list, contract_type }) => {
    return ContractType.getContractType(contract_types_list, contract_type);
};
export const onChangeContractType = (store: TTradeStore): TContractValues | Record<string, never> => {
    return ContractType.getContractValues(store);
};
