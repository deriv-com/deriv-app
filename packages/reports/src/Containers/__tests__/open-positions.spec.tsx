// TODO refactor old tests in this component
import React from 'react';
import { OpenPositionsTable } from '../open-positions';

describe('OpenPositions', () => {
    // jest.mock(
    //     '../open-positions.jsx',
    //     () =>
    //         jest.fn().mockReturnValue({
    //             OpenPositions: props => <div {...props}></div>,
    //         }),
    //     jest.fn().mockReturnValue({
    //         OpenPositionsTable: props => <div {...props}></div>,
    //     })
    // );

    it('should render one <OpenPositions /> component', async () => {
        // const OpenPositions = (await import('../index')).default.OpenPositions;
        // const wrapper = shallow(<OpenPositions />);
        // expect(wrapper).toHaveLength(1);
    });

    // it('should render one <OpenPositionsTable /> component', () => {
    //     const wrapper = shallow(<OpenPositionsTable />);
    //     expect(wrapper).toHaveLength(1);
    // });
});
