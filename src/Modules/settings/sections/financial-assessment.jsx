import PropTypes from 'prop-types';
import React     from 'react';
import Section   from '../components/section.jsx';

const FinancialAssessment = ({ title, description }) => (
    <Section title={title} description={description}>
        {/* content here */}
    </Section>
);

FinancialAssessment.propTypes = {
    description: PropTypes.string,
    title      : PropTypes.string,
};

export default FinancialAssessment;
