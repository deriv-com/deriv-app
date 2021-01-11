import React from 'react';

export const useBatchFile = (initial = []) => {
    const [file_list, setFileList] = React.useState(initial);
    const [current, setCurrent] = React.useState(null);

    const push = file => {
        setFileList([...file_list, file]);
    };

    const pop = () => {
        setFileList(file_list.pop());
    };

    React.useEffect(() => {
        setCurrent(file_list[file_list.length - 1]);
    }, [file_list.length]);

    return {
        file_list,
        setFileList,
        current,
        push,
        pop,
    };
};
