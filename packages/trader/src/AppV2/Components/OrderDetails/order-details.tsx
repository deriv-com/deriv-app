import React from 'react';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import useOrderDetails from 'AppV2/Hooks/useOrderDetails';
import { TContractInfo } from '@deriv/shared';
import CardWrapper from 'AppV2/Components/CardWrapper';
import { Localize } from '@deriv/translations';

interface ContractInfoProps {
    contract_info: TContractInfo;
}

const OrderDetails = ({ contract_info }: ContractInfoProps) => {
    const orderDetails = useOrderDetails(contract_info);
    const details = orderDetails ? orderDetails.details : {};
    return (
        <CardWrapper title={<Localize i18n_default_text='Order Details' />}>
            <div className='order-details'>
                <div className='order-details__table'>
                    {Object.entries(details).map(([key, value]) => (
                        <div className='order-details__table-row' key={key}>
                            <div className='order-details__table-row-cell'>
                                <Text size='sm' color='quill-typography__color--subtle'>
                                    {key}
                                </Text>
                            </div>
                            <div className='order-details__table-row-cell'>
                                {Array.isArray(value) ? (
                                    value.map((val, index) =>
                                        ['number', 'string'].includes(typeof val) ? (
                                            <Text key={`${key}_${index}`} size='sm'>
                                                {val}
                                            </Text>
                                        ) : (
                                            <CaptionText
                                                key={`${key}_${index}`}
                                                size='sm'
                                                color='quill-typography__color--subtle'
                                            >
                                                {val?.caption ?? ''}
                                            </CaptionText>
                                        )
                                    )
                                ) : (
                                    <Text size='sm'>{value}</Text>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardWrapper>
    );
};

export default OrderDetails;
