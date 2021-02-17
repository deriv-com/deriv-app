import * as React from 'react';
import { Icon } from '@deriv/components';
import icon from '@deriv/components/src/components/icon';

const getNavigationItems = type => {
    const deriv_url = 'https://deriv.com';
    switch (type) {
        case 'about':
            return [
                {
                    name: 'Our story',
                    to: `${deriv_url}/about/#story`,
                    icon: 'OurStory',
                },
                {
                    name: 'Our leadership',
                    to: `${deriv_url}/about/#leadership`,
                    icon: 'OurLeadership',
                },
                {
                    name: 'Regulatory information',
                    to: `${deriv_url}/regulatory/`,
                    icon: 'RegulatoryInfo',
                },
                {
                    name: 'Why choose us?',
                    to: `${deriv_url}/why-choose-us/`,
                    icon: 'WhyChooseUs',
                },
                {
                    name: 'Partnership programmes',
                    to: `${deriv_url}/partners/`,
                    icon: 'PartnershipProgrammes',
                },
                {
                    name: 'Contact us',
                    to: `${deriv_url}/contact_us/`,
                    icon: 'ContactUs',
                },
                {
                    name: 'Careers',
                    to: `${deriv_url}/careers/`,
                    icon: 'Careers',
                },
            ];
        case 'resources':
            return [
                {
                    name: 'Help centre',
                    to: `${deriv_url}/help-centre/`,
                    icon: 'HelpCentre',
                },
                {
                    name: 'Community',
                    to: `${deriv_url}/help-centre/`,
                    icon: 'Community',
                },
                {
                    name: 'Payment methods',
                    to: `${deriv_url}/payment-methods/`,
                    icon: 'PaymentMethods',
                },
                {
                    name: 'Blog',
                    to: `${deriv_url}/help-centre/`,
                    icon: 'Blog',
                },
            ];
        default:
            return [];
    }
};

const HeaderDropdown = () => {
    return (
        <React.Fragment>
            <div className='dashboard-dropdown'>
                {getNavigationItems('about-us').map((item, idx) => {
                    <div key={idx} className='dashboard-items'>
                        <Icon className='dashboard-icons' src={`IcDashboardHeader${item.icon}`} />
                        <p>{icon.name}</p>
                    </div>;
                })}
            </div>
        </React.Fragment>
    );
};

export default HeaderDropdown;
