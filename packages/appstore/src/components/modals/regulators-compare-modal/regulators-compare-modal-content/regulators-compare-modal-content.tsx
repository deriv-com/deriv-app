import React from 'react';
import { Table, Div100vhContainer, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { cfd_content, options_content } from 'Constants/regulators-modal-content';

const Row = ({ id, attribute, values }) => {
    return (
        <Table.Row className='regulators-compare-table__table-row'>
            <Table.Cell fixed>
                <Text as='p' weight='bold' align='left' color='prominent' size='xxs'>
                    {attribute}
                </Text>
            </Table.Cell>
            {Object.keys(values).map(rowKey => (
                <Table.Cell key={rowKey} className='regulators-compare-table__table-row-item'>
                    {Array.isArray(values[rowKey]?.text) ? (
                        (values[rowKey]?.text as []).map((item, index) => (
                            <Text key={index} as='p' weight=' normal' align='center' color='prominent' size='xxxs'>
                                {item}
                            </Text>
                        ))
                    ) : (
                        <Text as='p' align='center' color='prominent' size='xxxs'>
                            {values[rowKey]?.text}
                        </Text>
                    )}
                </Table.Cell>
            ))}
        </Table.Row>
    );
};

const RegulatorsCompareModalContent = () => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()} className='regulators-compare-table'>
            <div className='regulators-compare-table'>
                <Table className='regulators-compare-table__table'>
                    <Table.Header>
                        <Table.Row className={'regulators-compare-table__table-header'}>
                            <Table.Head fixed className='regulators-compare-table__table-empty-cell' />
                            <Table.Head className='regulators-compare-table__table-header-item'>
                                {localize('Non-EU regulators')}
                            </Table.Head>
                            <Table.Head className='regulators-compare-table__table-header-item'>
                                {localize('EU regulators')}
                            </Table.Head>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {cfd_content.map(row => (
                            <Row key={row.id} {...row} />
                        ))}
                        {options_content.map(row => (
                            <Row key={row.id} {...row} />
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </Div100vhContainer>
    );
};

export default RegulatorsCompareModalContent;
