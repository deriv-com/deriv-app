import { useContext } from 'react';
import BreakpointContext from '../contexts/BreakpointContext';

export const useBreakpoint = () => {
    const screens = useContext(BreakpointContext);

    return screens;
};

export default useBreakpoint;
