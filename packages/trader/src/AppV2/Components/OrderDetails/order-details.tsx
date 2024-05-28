import React from 'react';
import CardWrapper from '../CardWrapper';
import { Text } from '@deriv-com/quill-ui';
import useOrderDetails from 'AppV2/Hooks/useOrderDetails';
import { TContractInfo } from '@deriv/shared';
import { Localize } from '@deriv/translations';

interface ContractInfoProps {
    contract_info: TContractInfo;
}

const OrderDetails = ({ contract_info }: ContractInfoProps) => {
    const orderDetails = useOrderDetails(contract_info);
    const details = orderDetails ? orderDetails.details : {};
    return (
        <div className='order-details'>
            <CardWrapper title='Order Details'>
                <div className='table'>
                    {Object.entries(details).map(([key, value], index) => (
                        <div className='row' key={index}>
                            <div className='cell'>
                                <Text size='sm' color='quill-typography__color--subtle'>
                                    <Localize i18n_default_text={key} />
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
            </CardWrapper>
        </div>
    );
};

export default OrderDetails;
