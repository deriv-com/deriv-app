import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Table from 'Components/table';
import Wrapper from '../../shared/wrapper';
import sample_data from '../sample-data.json';

const FixedSize = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <Table fixed scroll_width='400' scroll_height='400'>
            <Table.Header>
                <Table.Row className='table-storybook-row'>
                    {sample_data.fields.map((field, index) => (
                        <Table.Head key={index}>{field.label}</Table.Head>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sample_data.data.map((item, index) => (
                    <Table.Row className='table-storybook-row' key={index}>
                        {sample_data.fields.map((field, key) => (
                            <React.Fragment key={key}>
                                {field.name === 'site' ? (
                                    <Table.Cell key={item.users.phone}>
                                        {sample_data.options.find(site => site.value === item.users[field.name]).label}
                                    </Table.Cell>
                                ) : (
                                    <Table.Cell key={key}>{item.users[field.name]}</Table.Cell>
                                )}
                            </React.Fragment>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </Wrapper>
);

export default FixedSize;
