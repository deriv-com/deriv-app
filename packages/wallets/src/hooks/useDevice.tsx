import { useWindowSize } from 'usehooks-ts';

/** A custom hook to check for the client device (Try to use this for behaviour only and not for hiding JSX element) */
const useDevice = () => {
    const { width } = useWindowSize();
    const is_mobile = width < 768;
    const is_tablet = width >= 768 && width < 1024;
    const is_desktop = width >= 1024;

    return {
        is_mobile,
        is_tablet,
        is_desktop,
    };
};

export default useDevice;
