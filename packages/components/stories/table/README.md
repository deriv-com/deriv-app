# Table component

Use this component to have a basic table.

## Usage

```jsx
import { Table } from 'deriv-components';

const DummyComponent = props => (
    <Table>
        <Table.Header>
            <Table.Row className='table-storybook-row'>
                {props.data.header.map((field, index) => (
                    <Table.Head key={index}>{field.label}</Table.Head>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {props.data.rows.map((row, index) => (
                <Table.Row className='table-storybook-row' key={index}>
                    {row.cells.map((cell, key) => (
                        <Table.Cell key={key}>{cell.name}</Table.Cell>
                    ))}
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);
```

## Props

| Name          | Type      | Default | Description                                                |
| ------------- | --------- | ------- | ---------------------------------------------------------- |
| fixed         | {boolean} | null    | Set it to 'true' to have customed scrollbar for the table  |
| scroll_width  | {string}  | 100%    | If 'fixed' is 'true' you can set fixed width of the table  |
| scroll_height | {string}  | null    | If 'fixed' is 'true' you can set fixed height of the table |

## Full example:

```jsx
import { Table } from 'deriv-components';

const DummyComponent = props => (
    <Table fixed scroll_width='400' scroll_height='400'>
        <Table.Header>
            <Table.Row className='table-storybook-row'>
                {props.data.header.map((field, index) => (
                    <Table.Head key={index}>{field.label}</Table.Head>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {props.data.rows.map((row, index) => (
                <Table.Row className='table-storybook-row' key={index}>
                    {row.cells.map((cell, key) => (
                        <Table.Cell key={key}>{cell.name}</Table.Cell>
                    ))}
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);
```
