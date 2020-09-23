import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const Text = styled.p`
    font-size: ${props => props.size || '16px'};
`;

export default Text;
