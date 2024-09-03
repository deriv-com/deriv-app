import { localize } from 'Components/i18next';

type TTimeRange = {
    start_min: number | null;
    end_min: number | null;
};

type TDaysOfWeek = Record<
    number,
    {
        label: string;
        shortLabel: string;
        value: string;
    }
>;

type TBusinessDay = {
    day: string;
    short_day: string;
    time: JSX.Element;
    start_time: string;
    end_time: string;
    value: keyof typeof DAYS_OF_WEEK;
};

const MINUTES_IN_DAY = 1440;

const DAYS_OF_WEEK = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

// This function returns an object with the days of the week, their labels, and their values
export const getDaysOfWeek = (): TDaysOfWeek => {
    return {
        0: {
            label: localize('Sunday'),
            shortLabel: localize('S'),
            value: 'sunday',
        },
        1: {
            label: localize('Monday'),
            shortLabel: localize('M'),
            value: 'monday',
        },
        2: {
            label: localize('Tuesday'),
            shortLabel: localize('T'),
            value: 'tuesday',
        },
        3: {
            label: localize('Wednesday'),
            shortLabel: localize('W'),
            value: 'wednesday',
        },
        4: {
            label: localize('Thursday'),
            shortLabel: localize('T'),
            value: 'thursday',
        },
        5: {
            label: localize('Friday'),
            shortLabel: localize('F'),
            value: 'friday',
        },
        6: {
            label: localize('Saturday'),
            shortLabel: localize('S'),
            value: 'saturday',
        },
    };
};

/**
 * The below function adjusts the overflow and carry forward to the previous day or next day
 * @param timeRanges
 * @returns
 */
const adjustOverflow = (timeRanges: TTimeRange[]) => {
    const adjustedRanges = [...timeRanges];
    const dayMinutes = 1440;

    for (let i = 0; i < adjustedRanges.length; i++) {
        // Handle positive values, ie offset < 0 => ahead GMT where time overflow to the next day
        const maxEndMin = (i + 1) * dayMinutes;
        if (adjustedRanges[i].end_min && (adjustedRanges[i].end_min as number) > maxEndMin) {
            const overflow = (adjustedRanges[i].end_min as number) - maxEndMin;
            adjustedRanges[i].end_min = maxEndMin;

            const nextIndex = (i + 1) % 7;
            if (adjustedRanges[nextIndex].start_min !== null) {
                adjustedRanges[nextIndex].start_min -= overflow;
            }
        }

        // Handle for negative values, ie offset > 0 => behind GMT where start will be negative
        if (adjustedRanges[i]?.start_min !== null && (adjustedRanges[i]?.start_min as number) < i * dayMinutes) {
            const underflow = i * dayMinutes - (adjustedRanges[i].start_min as number);
            adjustedRanges[i].start_min = i * dayMinutes;
            const prevIndex = (i - 1 + 7) % 7;
            if (adjustedRanges[prevIndex].end_min !== null) {
                adjustedRanges[prevIndex].end_min += underflow;
            }
        }
    }

    return adjustedRanges;
};

/**
 * The below function adjusts the time by adding or subtracting the offset based on the timezone
 * @param timeRanges
 * @param offset
 * @returns
 */
const adjustTimeRangesWithOffset = (timeRanges: TTimeRange[], offset: number) => {
    // Separate null and non-null ranges
    let nonNullRanges: TRange[] = [];

    timeRanges.forEach(range => {
        if (range.start_min !== null && range.end_min !== null) {
            nonNullRanges.push(range as TRange);
        }
    });

    // Adjust the non-null ranges
    nonNullRanges = nonNullRanges.map(range => {
        let adjustedStart = range.start_min;
        let adjustedEnd = range.end_min;

        if (adjustedStart !== null) {
            adjustedStart -= offset;
        }

        if (adjustedEnd !== null) {
            adjustedEnd -= offset;
        }

        return { start_min: adjustedStart, end_min: adjustedEnd };
    });

    // Sort the adjusted non-null ranges
    nonNullRanges.sort((a, b) => a.start_min - b.start_min);

    // Merge back the null values into their original positions
    let result: TTimeRange[] = [];
    let nonNullIndex = 0;
    timeRanges.forEach(range => {
        if (range.start_min !== null && range.end_min !== null) {
            result.push(nonNullRanges[nonNullIndex++]);
        } else {
            result.push(range);
        }
    });

    if (result.length > 7) {
        if (offset < 0) {
            result[0].start_min =
                (result[0].start_min ?? 0) - ((result[7]?.end_min ?? 0) - (result[7]?.start_min ?? 0));
            result = result.splice(0, 7);
        } else if (offset > 0) {
            result[7].end_min = (result[7].end_min ?? 0) + ((result[0]?.end_min ?? 0) - (result[0]?.start_min ?? 0));
            result = result.splice(1, 8);
        }
    }

    return adjustOverflow(result);
};

/**
 * The below function adds null objects for gaps greater than or equal to 1440 minutes
 * @param splitRanges
 * @returns
 */
const addNullObjectsForGaps = (splitRanges: TTimeRange[], offset = 0) => {
    const finalRanges = [];
    const MINUTES_IN_DAY = 1440;
    const MINUTES_IN_WEEK = MINUTES_IN_DAY * 7;

    // Check for gap at the start of the week
    const firstStart = splitRanges.length > 0 ? splitRanges[0].start_min ?? 0 : MINUTES_IN_WEEK;
    if (firstStart > 0) {
        const nullObjectsCount = Math.floor((firstStart - offset) / MINUTES_IN_DAY);
        for (let i = 0; i < nullObjectsCount; i++) {
            finalRanges.push({ start_min: null, end_min: null });
        }
    }

    for (let i = 0; i < splitRanges.length; i++) {
        finalRanges.push(splitRanges[i]);
        if (i < splitRanges.length - 1) {
            const currentEnd = splitRanges[i].end_min ?? 0;
            const nextStart = splitRanges[i + 1].start_min ?? 0;
            const gap = nextStart - currentEnd;

            // Calculate the number of null objects needed
            if (gap >= MINUTES_IN_DAY) {
                const nullObjectsCount = Math.floor(gap / MINUTES_IN_DAY);
                for (let j = 0; j < nullObjectsCount; j++) {
                    finalRanges.push({ start_min: null, end_min: null });
                }
            }
        }
    }

    // Check for gap at the end of the week
    const lastEnd = splitRanges.length > 0 ? splitRanges[splitRanges.length - 1].end_min ?? 0 : 0;
    if (lastEnd < MINUTES_IN_WEEK) {
        const nullObjectsCount = Math.floor((MINUTES_IN_WEEK - (lastEnd - offset)) / MINUTES_IN_DAY);
        for (let i = 0; i < nullObjectsCount; i++) {
            finalRanges.push({ start_min: null, end_min: null });
        }
    }
    return finalRanges;
};

type TRange = {
    start_min: number;
    end_min: number;
};

/**
 * 
    This function splits the time ranges into intervals for each day of the week
    Then also handles overflow and adjusts the time ranges based on the timezone offset
    eg. If the timezone offset is -10, the time ranges will be adjusted 10 hours back
    eg. If the timezone offset is +10, the time ranges will be adjusted 10 hours forward
    eg. If the input is [
    { "start_min":0, "end_min": 1440 },
    { "start_min":2880, "end_min": 10080 },
    ]
    and the timezone offset is 0, the output will be 
    [
        { "start_min":0, "end_min": 1440 },
        { "start_min":null, "end_min": null },
        { "start_min":2880, "end_min": 4320 },
        { "start_min":4320, "end_min": 5760 },
        { "start_min":5760, "end_min": 7200 },
        { "start_min":7200, "end_min": 8640 },
        { "start_min":8640, "end_min": 10080 }
    ]

 * @param timeRanges 
 * @param timezoneOffset 
 * @returns 
 */

export const splitTimeRange = (timeRanges: TRange[] = [], offset = 0): TTimeRange[] => {
    // Handle the case when timeRanges is undefined or an empty array
    if (!timeRanges || timeRanges.length === 0) {
        const fullWeek = [];
        for (let day = 0; day < 7; day++) {
            fullWeek.push({
                start_min: day * MINUTES_IN_DAY,
                end_min: (day + 1) * MINUTES_IN_DAY,
            });
        }
        return fullWeek;
    }

    const splitRanges: TRange[] = [];

    // Split the ranges if they exceed 1440 minutes
    timeRanges.forEach(range => {
        let start = range.start_min;
        const end = range.end_min;

        while (end - start > MINUTES_IN_DAY) {
            splitRanges.push({
                start_min: start,
                end_min: start + MINUTES_IN_DAY,
            });
            start += MINUTES_IN_DAY;
        }

        splitRanges.push({
            start_min: start,
            end_min: end,
        });
    });

    // Sort the split ranges
    splitRanges.sort((a, b) => a.start_min - b.start_min);

    const resultWithGaps = addNullObjectsForGaps(splitRanges, offset);

    const resultWithOffset = adjustTimeRangesWithOffset(resultWithGaps, offset);
    return resultWithOffset;
};

/**
 * Function to get the AM or PM value based on the minute value
 * @param minute
 * @returns  {string}
 */
const getAMPM = (minute: number) => {
    // Calculate the hour from the minute value
    const hour = Math.floor(minute / 60) % 24;

    // Determine if it's AM or PM based on the hour
    if (hour < 12) {
        return 'am';
    }
    return 'pm';
};

/**
 * Function to format the time in 12-hour format (e.g., 12:00 am)
 * @param minutes
 * @returns
 */
export const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let ampm = getAMPM(minutes);
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins.toString();

    // Special case for midnight (00:00)
    if (hours === 0) {
        ampm = 'am';
    }

    return `${formattedHours}:${formattedMins} ${ampm}`;
};

type TTimeOption = {
    text: string;
    value: string;
};
/**
 * Function to get a list of hours in 15-minute intervals
 * @param intervalInMinutes
 * @returns {Array}
 */
export const getHoursList = (intervalInMinutes = 15): TTimeOption[] => {
    // Initialize an empty array to store the time options
    const hoursList = [];

    // Create a Date object for the start of the day (midnight)
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    // Create a Date object for the end of the day (just before midnight)
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    // Create a copy of startTime to use for iterating through the day
    const currentTime = new Date(startTime);

    // Loop until we reach the end of the day
    while (currentTime <= endTime) {
        // Extract hours and minutes from the current time
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        // Localize the text representation of the time (e.g., "12:00 am")
        const text = formatTime(hours * 60 + minutes);

        // Calculate the total minutes since midnight for the value
        const value = text;

        // Add the time option to the hoursList array
        hoursList.push({ text, value });

        // Move currentTime forward by the specified interval in minutes
        currentTime.setTime(currentTime.getTime() + intervalInMinutes * 60000);
    }

    // Return the array of time options
    return hoursList;
};

/**
 * Function to get the minutes from the day of the week and AM/PM time
 * @param dayOfWeekValue
 * @param ampmTime
 * @returns
 */
const getMinutesFromAMPM = (dayOfWeekValue: keyof typeof DAYS_OF_WEEK, ampmTime: string) => {
    if (ampmTime === null) {
        return null;
    }

    const [timeStr, ampm] = ampmTime.split(' ');
    const [hoursStr, minsStr] = timeStr.split(':');
    const hours = parseInt(hoursStr);
    const mins = parseInt(minsStr);

    let hours_in_24_format;
    if (ampm.toLowerCase() === 'am') {
        hours_in_24_format = hours === 12 ? 0 : hours;
    } else {
        hours_in_24_format = hours === 12 ? 12 : hours + 12;
    }

    return hours_in_24_format * 60 + mins + DAYS_OF_WEEK[dayOfWeekValue] * 1440;
};

/**
 * Function to convert the data to minutes range
 * @param edited_data
 * @returns
 */
export const convertToMinutesRange = (edited_data: TBusinessDay[]) => {
    return edited_data.map(day => {
        const start_min = getMinutesFromAMPM(day.value, day.start_time);
        let end_min = getMinutesFromAMPM(day.value, day.end_time);

        // Adjust end_min if it's 12 AM to be 1440 minutes (24 hours)
        if (start_min !== null && end_min !== null) {
            if (end_min === start_min) {
                end_min = start_min + 1440;
            }

            // Handle the case where the end time is 12 AM then set it to end of the particular day in minutes => 1440 * (day + 1)
            if (end_min === MINUTES_IN_DAY * DAYS_OF_WEEK[day.value]) {
                end_min = (DAYS_OF_WEEK[day.value] + 1) * MINUTES_IN_DAY;
            }
        }

        return {
            start_min,
            end_min,
        };
    });
};

/**
 * Function to convert the times to GMT along with handling overflow and carry forward to next day
 * @param times
 * @param offsetMinutes
 * @returns
 */
export const convertToGMTWithOverflow = (times: TTimeRange[], offsetMinutes: number) => {
    const MINUTES_IN_DAY = 1440;
    const minutesInWeek = 7 * MINUTES_IN_DAY; // Total minutes in a week

    const convertedTimes: TTimeRange[] = [];

    times.forEach(time => {
        let startGMT = ((time.start_min ?? 0) + offsetMinutes) % minutesInWeek;
        let endGMT = ((time.end_min ?? 0) + offsetMinutes) % minutesInWeek;

        if (startGMT < 0) {
            startGMT += minutesInWeek;
        }
        if (endGMT < 0) {
            endGMT += minutesInWeek;
        }

        if (startGMT <= endGMT) {
            convertedTimes.push({
                start_min: startGMT,
                end_min: endGMT,
            });
        } else {
            // Handle overflow
            convertedTimes.push({
                start_min: startGMT,
                end_min: minutesInWeek,
            });
            convertedTimes.push({
                start_min: 0,
                end_min: endGMT,
            });
        }
    });

    return convertedTimes;
};

/**
 * Function to check if the time is edited by the user
 * @param data
 * @param edited_data
 * @returns
 */
export const isTimeEdited = (data: TBusinessDay[], edited_data: TBusinessDay[]): boolean => {
    if (data.length !== edited_data?.length) {
        return true;
    }

    return data.reduce((isDirty, item, index) => {
        if (isDirty) {
            return true;
        }

        const editedItem = edited_data[index];

        return item.start_time !== editedItem.start_time || item.end_time !== editedItem.end_time;
    }, false);
};

/**
 * Function to add disabled property to hoursList based on start or end type
 * @param hoursList
 * @param type
 * @param value
 * @returns {Array}
 */
export const getDropdownList = (hoursList: TTimeOption[], type: string, value: string, should_disable = true) => {
    const referenceIndex = hoursList.findIndex(hour => hour.value === value);

    return hoursList.map((hour, index) => {
        let disabled = false;
        if (
            should_disable &&
            ((type === 'start' && index >= referenceIndex) || (type === 'end' && index <= referenceIndex))
        ) {
            disabled = true;
        }

        return { ...hour, disabled };
    });
};
