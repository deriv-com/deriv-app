const useServerUnderMaintenance = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getUTCDay();
    const currentHour = currentDate.getUTCHours();

    return currentDay === 0 && currentHour === 6; // Sunday 6am UTC
};

export default useServerUnderMaintenance;
