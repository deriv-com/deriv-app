import React from 'react';
import { Table } from '@deriv/components';
import { isDesktop } from '@deriv/shared';

const TestTable = () => {
    return (
        <div className='dc-vertical-tab__content-container'>
            <Table fixed className='login-history__table'>
                {isDesktop() && (
                    <Table.Header>
                        <Table.Row className='login-history__table__header'>
                            <Table.Head>name</Table.Head>
                            <Table.Head>age</Table.Head>
                            <Table.Head>gender</Table.Head>
                            <Table.Head>email</Table.Head>
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body>
                    <Table.Row className='login-history__table__row'>
                        <Table.Cell>iman</Table.Cell>
                        <Table.Cell>19</Table.Cell>
                        <Table.Cell>male</Table.Cell>
                        <Table.Cell>iman@gmail.com</Table.Cell>
                    </Table.Row>

                    <Table.Row className='login-history__table__row'>
                        <Table.Cell>shayan</Table.Cell>
                        <Table.Cell>23</Table.Cell>
                        <Table.Cell>male</Table.Cell>
                        <Table.Cell>shayan@gmail.com</Table.Cell>
                    </Table.Row>

                    <Table.Row className='login-history__table__row'>
                        <Table.Cell>sahar</Table.Cell>
                        <Table.Cell>24</Table.Cell>
                        <Table.Cell>female</Table.Cell>
                        <Table.Cell>sahar@gmail.com</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    );
};

export default TestTable;
