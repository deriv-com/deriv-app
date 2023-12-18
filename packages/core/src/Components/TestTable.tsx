import React from 'react';
import { Table } from '@deriv/components';
import { isDesktop } from '@deriv/shared';

const TestTable = () => {
    return (
        <>
            <Table>
                {isDesktop() && (
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>name</Table.Head>
                            <Table.Head>age</Table.Head>
                            <Table.Head>gender</Table.Head>
                            <Table.Head>email</Table.Head>
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>name1</Table.Cell>
                        <Table.Cell>19</Table.Cell>
                        <Table.Cell>male</Table.Cell>
                        <Table.Cell>name1@gmail.com</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>name2</Table.Cell>
                        <Table.Cell>23</Table.Cell>
                        <Table.Cell>male</Table.Cell>
                        <Table.Cell>name2@gmail.com</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>name3</Table.Cell>
                        <Table.Cell>24</Table.Cell>
                        <Table.Cell>female</Table.Cell>
                        <Table.Cell>name3@gmail.com</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
};

export default TestTable;
