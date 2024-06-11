import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import useOrderDetails from 'AppV2/Hooks/useOrderDetails';
import { TContractInfo } from '@deriv/shared';

interface ContractInfoProps {
    contract_info: TContractInfo;
}

const OrderDetails = ({ contract_info }: ContractInfoProps) => {
    const orderDetails = useOrderDetails(contract_info);
    const details = orderDetails ? orderDetails.details : {};
    return (
        <div className='order-details'>
            <div className='table'>
                {Object.entries(details).map(([key, value], index) => (
                    <div className='row' key={index}>
                        <div className='cell'>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                {key}
                            </Text>
                        </div>
                        <div className='cell'>
                            {Array.isArray(value) ? (
                                value.map((val, i) => (
                                    <Text key={i} size='sm'>
                                        {val}
                                    </Text>
                                ))
                            ) : (
                                <Text size='sm'>{value as string | number}</Text>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetails;
