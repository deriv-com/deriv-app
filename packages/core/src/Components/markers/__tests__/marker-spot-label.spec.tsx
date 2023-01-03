// TODO refactor old tests in this component
import React from 'react';
import MarkerSpotLabel from '../marker-spot-label.jsx';

describe('MarkerSpotLabel', () => {
    it('should render one <MarkerSpotLabel /> component', () => {
        // const wrapper = shallow(<MarkerSpotLabel />);
        // expect(wrapper).toHaveLength(1);
    });
    // it('should have class .chart-spot-label__time-value-container--top if align_label top is passed in props', () => {
    //     const wrapper = shallow(<MarkerSpotLabel align_label={'top'} />);
    //     expect(wrapper.find('.chart-spot-label__time-value-container--top').exists()).toBe(true);
    // });
    // it('should have class .chart-spot-label__time-value-container--bottom if align_label bottom is passed in props', () => {
    //     const wrapper = shallow(<MarkerSpotLabel align_label={'bottom'} />);
    //     expect(wrapper.find('.chart-spot-label__time-value-container--bottom').exists()).toBe(true);
    // });
    // it('should have class .chart-spot-label__time-value-container--top if no align_label is passed in props', () => {
    //     const wrapper = shallow(<MarkerSpotLabel />);
    //     expect(wrapper.find('.chart-spot-label__time-value-container--top').exists()).toBe(true);
    //     expect(wrapper.find('.chart-spot-label__time-value-container--bottom').exists()).toBe(false);
    // });
    // it('should toggle label on hover if has_hover_toggle is passed in props', async () => {
    //     const wrapper = mount(<MarkerSpotLabel has_hover_toggle={true} />);
    //     expect(wrapper.find('.chart-spot-label__info-container').exists()).toBe(false);

    //     wrapper.find('.marker-hover-container').simulate('mouseenter');
    //     wrapper.update();
    //     expect(wrapper.find('.chart-spot-label__info-container').exists()).toBe(true);

    //     wrapper.find('.marker-hover-container').simulate('mouseleave');
    //     wrapper.update();
    //     expect(wrapper.find('.chart-spot-label__info-container').exists()).toBe(false);
    // });
    // it('should not toggle label on hover if has_label_toggle is not passed in props', () => {
    //     const wrapper = shallow(<MarkerSpotLabel />);
    //     expect(wrapper.find('.chart-spot-label__info-container').exists()).toBe(true);
    //     expect(wrapper.find('.marker-hover-container').exists()).toBe(false);
    // });
    // it('should have class .chart-spot-label__value-container--won if status won is passed in props', () => {
    //     const wrapper = shallow(<MarkerSpotLabel status={'won'} />);
    //     expect(wrapper.find('.chart-spot-label__value-container--won').exists()).toBe(true);
    // });
    // it('should have class .chart-spot-label__value-container--lost if status lost is passed in props', () => {
    //     const wrapper = shallow(<MarkerSpotLabel status={'lost'} />);
    //     expect(wrapper.find('.chart-spot-label__value-container--lost').exists()).toBe(true);
    // });
});
