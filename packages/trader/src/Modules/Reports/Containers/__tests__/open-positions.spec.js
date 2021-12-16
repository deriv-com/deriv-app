import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import OpenPositions from '../open-positions.jsx';

configure({ adapter: new Adapter() });

describe('OpenPositions', () => {
    it('should render one <OpenPositions /> component', () => {
        const wrapper = shallow(<OpenPositions />);
        expect(wrapper).to.have.length(1);
        console.log(wrapper.debug());
    });

    // it('should have ..empty-trade-history and have not .open-positions if active_positions is an empty array', () => {
    //     const wrapper = shallow(<OpenPositions active_positions={[]} />);
    //     expect(wrapper.find('.empty-trade-history').exists()).to.be.true;
    //     expect(wrapper.find('.open-positions').exists()).to.be.false;
    // });

    // });
    // it("should render child <OpenPositionsTable /> component when passed in", () => {
    //     const child_div = <OpenPositionsTable />;
    //     const wrapper = shallow(<OpenPositions>{child_div}</OpenPositions>);
    //     expect(wrapper.contains(child_div)).to.equal(true);
    // });
});
