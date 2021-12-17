import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import OpenPositions, { OpenPositionsTable } from '../open-positions.jsx';

configure({ adapter: new Adapter() });

describe('OpenPositions', () => {
    it('should render one <OpenPositions /> component', () => {
        const wrapper = shallow(<OpenPositions />);
        expect(wrapper).to.have.length(1);
        console.log(wrapper.debug());
    });

    it('should render child <OpenPositionsTable /> component when passed in', () => {
        const child_div = <OpenPositionsTable />;
        const wrapper = shallow(<OpenPositions>{child_div}</OpenPositions>);
        expect(wrapper.contains(child_div)).to.equal(true);
    });

    it('should have .open-positions and have not .empty-trade-history if active_positions have array of open positions', () => {
        const wrapper = shallow(<OpenPositions />);
        expect(wrapper.find('.open-positions').exists()).to.be.true;
        expect(wrapper.find('.empty-trade-history').exists()).to.be.false;
    });
});
