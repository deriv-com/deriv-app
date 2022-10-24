import React from 'react';
import { expect } from 'chai';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PurchaseButtonsOverlay from '../purchase-buttons-overlay.jsx';

configure({ adapter: new Adapter() });

describe('PurchaseButtonsOverlay', () => {
    const message = 'You can only purchase one contract at a time';

    it('should render <PurchaseButtonsOverlay /> component', () => {
        const wrapper = mount(<PurchaseButtonsOverlay message={message} />);
        const has_correct_message = wrapper.contains(message);
        expect(has_correct_message).to.equal(true);
    });

    it('should have purchase-buttons-overlay__one-button class when is_to_cover_one_button prop is passed', () => {
        const wrapper = mount(<PurchaseButtonsOverlay message={message} is_to_cover_one_button />);
        expect(wrapper.render()[0].attribs.class).to.match(/__one-button/);
    });
});
