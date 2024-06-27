import { useQuery } from '@deriv/api';
import { TSocketRequestQueryOptions } from '@deriv/api/types';

const useTinValidations = (tax_residence: string, options?: TSocketRequestQueryOptions<'tin_validations'>) => {
    const { data, ...rest } = useQuery('tin_validations', {
        payload: { tax_residence },
        options: {
            enabled: !!tax_residence,
            staleTime: Infinity,
            ...options,
        },
    });

    return { ...rest, data: data?.tin_validations ?? [] };
};

export default useTinValidations;
