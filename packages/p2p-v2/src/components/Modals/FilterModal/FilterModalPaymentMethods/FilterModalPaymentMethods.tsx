import React, { useEffect, useState } from 'react';
import { Search } from '@/components/Search';
import { p2p } from '@deriv/api-v2';
import { Checkbox, Text } from '@deriv-com/ui';
import './FilterModalPaymentMethods.scss';

type TFilterModalPaymentMethodsProps = {
    selectedPaymentMethods: string[];
    setSelectedPaymentMethods: (value: string[]) => void;
};

type TPaymentMethodData = ReturnType<typeof p2p.paymentMethods.useGet>['data'];

const FilterModalPaymentMethods = ({
    selectedPaymentMethods,
    setSelectedPaymentMethods,
}: TFilterModalPaymentMethodsProps) => {
    const { data } = p2p.paymentMethods.useGet();
    const [searchedPaymentMethod, setSearchedPaymentMethod] = useState<string>('');
    const [searchedPaymentMethods, setSearchedPaymentMethods] = useState<TPaymentMethodData>(data);

    const onSearch = (value: string) => {
        if (!value) {
            setSearchedPaymentMethods(data);
            return;
        }
        setSearchedPaymentMethod(value);
        if (value) {
            setSearchedPaymentMethods(
                data?.filter(paymentMethod => paymentMethod.display_name.toLowerCase().includes(value.toLowerCase()))
            );
        }
    };

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(searchedPaymentMethods)) setSearchedPaymentMethods(data);
    }, [data]);

    return (
        <div className='p2p-v2-filter-modal-payment-methods'>
            <Search
                delayTimer={0}
                name='search-payment-method'
                onSearch={(value: string) => onSearch(value)}
                placeholder='Search payment method'
            />
            {searchedPaymentMethods?.length > 0 ? (
                <div>
                    {searchedPaymentMethods?.map(paymentMethod => (
                        <Checkbox
                            checked={selectedPaymentMethods?.includes(paymentMethod.id)}
                            key={paymentMethod.id}
                            label={paymentMethod.display_name}
                            name={paymentMethod.id}
                            onChange={event => {
                                if (event.target.checked) {
                                    setSelectedPaymentMethods([...selectedPaymentMethods, paymentMethod.id]);
                                } else {
                                    setSelectedPaymentMethods(
                                        selectedPaymentMethods.filter(id => id !== paymentMethod.id)
                                    );
                                }
                            }}
                            wrapperClassName='p-[1.6rem] leading-[3rem]'
                        />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col justify-center mt-64 break-all'>
                    <Text align='center' weight='bold'>
                        No results for &quot;{searchedPaymentMethod}&quot;.
                    </Text>
                    <Text align='center'>Check your spelling or use a different term.</Text>
                </div>
            )}
        </div>
    );
};

export default FilterModalPaymentMethods;
