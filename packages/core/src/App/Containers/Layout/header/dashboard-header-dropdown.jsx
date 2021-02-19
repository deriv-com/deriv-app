import * as React from 'react';
import { Text } from '@deriv/components';
import Blog from 'Assets/SvgComponents/header/blog.svg';
import Career from 'Assets/SvgComponents/header/careers.svg';
import Community from 'Assets/SvgComponents/header/community.svg';
import ContactUs from 'Assets/SvgComponents/header/contact-us.svg';
import HelpCentre from 'Assets/SvgComponents/header/help-centre.svg';
import OurLeadership from 'Assets/SvgComponents/header/our-leadership.svg';
import OurStory from 'Assets/SvgComponents/header/our-story.svg';
import PartnershipProgrammes from 'Assets/SvgComponents/header/partnership-programmes.svg';
import PaymentMethods from 'Assets/SvgComponents/header/payment-methods.svg';
import RegulatoryInfo from 'Assets/SvgComponents/header/regulatory-info.svg';
import WhyChooseUs from 'Assets/SvgComponents/header/why-choose-us.svg';

const getNavigationItems = type => {
    const deriv_url = 'https://deriv.com';
    switch (type) {
        case 'about':
            return [
                {
                    name: 'Our story',
                    to: `${deriv_url}/about/#story`,
                    icon: <OurStory />,
                },
                {
                    name: 'Our leadership',
                    to: `${deriv_url}/about/#leadership`,
                    icon: <OurLeadership />,
                },
                {
                    name: 'Regulatory information',
                    to: `${deriv_url}/regulatory/`,
                    icon: <RegulatoryInfo />,
                },
                {
                    name: 'Why choose us?',
                    to: `${deriv_url}/why-choose-us/`,
                    icon: <WhyChooseUs />,
                },
                {
                    name: 'Partnership programmes',
                    to: `${deriv_url}/partners/`,
                    icon: <PartnershipProgrammes />,
                },
                {
                    name: 'Contact us',
                    to: `${deriv_url}/contact_us/`,
                    icon: <ContactUs />,
                },
                {
                    name: 'Careers',
                    to: `${deriv_url}/careers/`,
                    icon: <Career />,
                },
            ];
        case 'resources':
            return [
                {
                    name: 'Help centre',
                    to: `${deriv_url}/help-centre/`,
                    icon: <HelpCentre />,
                },
                {
                    name: 'Community',
                    to: `${deriv_url}/help-centre/`,
                    icon: <Community />,
                },
                {
                    name: 'Payment methods',
                    to: `${deriv_url}/payment-methods/`,
                    icon: <PaymentMethods />,
                },
                {
                    name: 'Blog',
                    to: `${deriv_url}/help-centre/`,
                    icon: <Blog />,
                },
            ];
        default:
            return [];
    }
};

const HeaderItem = ({ icon, name, to }) => {
    return (
        <a href={to} className='dashboard-header-dropdown__card-link'>
            <div className='dashboard-header-dropdown__card-link__icon'>{icon}</div>
            <Text size='s'>{name}</Text>
        </a>
    );
};

const HeaderDropdown = ({ current_ref, onClickHandler, parent, setRef }) => {
    const [left_offset, set_left_offset] = React.useState(current_ref?.offsetLeft);
    const dropdown_container_ref = React.useRef(null);

    const updateOffsets = () => {
        if (current_ref) {
            set_left_offset(current_ref.offsetLeft);
        }
    };

    React.useEffect(() => {
        if (dropdown_container_ref) {
            setRef(dropdown_container_ref);
        }
        window.addEventListener('resize', updateOffsets);
        return () => {
            window.removeEventListener('resize', updateOffsets);
        };
    });

    return (
        <React.Fragment>
            <div ref={dropdown_container_ref} className='dashboard-header-dropdown' style={{ left: left_offset }}>
                <div className='dashboard-header-dropdown__wrapper'>
                    <div className='dashboard-header-dropdown__wrapper__card-wrapper'>
                        {getNavigationItems(parent).map((item, idx) => (
                            <HeaderItem key={idx} onClick={onClickHandler} {...item} />
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default HeaderDropdown;
