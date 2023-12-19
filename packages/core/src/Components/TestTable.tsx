import React from 'react';
import { Table, Table2 } from '@deriv/components';
import { isDesktop } from '@deriv/shared';

const TestTable = () => {
    return (
        <>
            <h1>old one</h1>
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
            <hr />
            <h1>new one</h1>
            <Table2 fixed>
                {isDesktop() && (
                    <Table2.Header>
                        <Table2.Row>
                            <Table2.Head align='right'>name</Table2.Head>
                            <Table2.Head>age</Table2.Head>
                            <Table2.Head>gender</Table2.Head>
                            <Table2.Head>email</Table2.Head>
                        </Table2.Row>
                    </Table2.Header>
                )}
                <Table2.Body>
                    <Table2.Row has_hover>
                        <Table2.Cell>name1</Table2.Cell>
                        <Table2.Cell>19</Table2.Cell>
                        <Table2.Cell align='right'>male</Table2.Cell>
                        <Table2.Cell>name1@gmail.com</Table2.Cell>
                    </Table2.Row>

                    <Table2.Row>
                        <Table2.Cell>name2</Table2.Cell>
                        <Table2.Cell>23</Table2.Cell>
                        <Table2.Cell>male</Table2.Cell>
                        <Table2.Cell>name2@gmail.com</Table2.Cell>
                    </Table2.Row>

                    <Table2.Row>
                        <Table2.Cell>name3</Table2.Cell>
                        <Table2.Cell>24</Table2.Cell>
                        <Table2.Cell>female</Table2.Cell>
                        <Table2.Cell>name3@gmail.com</Table2.Cell>
                    </Table2.Row>
                </Table2.Body>
            </Table2>
        </>
    );
};

export default TestTable;
