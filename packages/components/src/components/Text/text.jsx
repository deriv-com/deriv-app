import styled from 'styled-components';
import { baseStyles, responsiveStyles } from '../responsive-style';

const Text = styled.p`
    font-size: ${props => props.font_size};
    line-height: ${props => props.line_height || '1.5'};
    font-weight: ${props => props.font_weight || 'normal'};
    ${baseStyles}
    ${responsiveStyles}
`;

export default Text;
