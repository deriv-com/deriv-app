import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedList from '../animated-list';

const Item = ({ message }: { message: string }) => <div>{message}</div>;

describe('AnimatedList', () => {
    it('Should render the list of items', () => {
        const list = [
            { id: '1', message: 'Success message' },
            { id: '2', message: 'Error message' },
            { id: '3', message: 'Info message' },
        ];

        render(
            <AnimatedList>
                {list.map(item => (
                    <Item key={item.id} {...item} />
                ))}
            </AnimatedList>
        );

        expect(screen.getAllByTestId('dt_list_item')).toHaveLength(3);
    });
});
