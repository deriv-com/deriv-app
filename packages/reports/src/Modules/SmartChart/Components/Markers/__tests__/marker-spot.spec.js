import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MarkerSpot from '../marker-spot.jsx';

configure({ adapter: new Adapter() });

describe('MarkerSpot', () => {
    it('should render one <MarkerSpot /> component', () => {
        const wrapper = shallow(<MarkerSpot />);
        expect(wrapper).toHaveLength(1);
    });
    it('should not have class .chart-spot__spot--lost or .chart-spot__spot--won if no status is passed in props', () => {
        const wrapper = shallow(<MarkerSpot />);
        expect(wrapper.find('.chart-spot__spot--lost').exists()).toBe(false);
        expect(wrapper.find('.chart-spot__spot--lost').exists()).toBe(false);
        expect(wrapper.find('.chart-spot').exists()).toBe(true);
    });
});
