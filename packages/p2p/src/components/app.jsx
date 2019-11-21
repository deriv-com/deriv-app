import React from 'react';
import styled from 'styled-components';
import '../styles/app.scss';

const StyledDiv = styled.div`
    background: var(--general-section-1);
    color: var(--text-general);
`;

const App = () => <StyledDiv>Hello p2p</StyledDiv>;

export default App;
