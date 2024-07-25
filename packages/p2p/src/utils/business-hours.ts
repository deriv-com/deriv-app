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

// This function sorts the time ranges by start time
const getSortedTimeRanges = (timeRanges: TTimeRange[]): TTimeRange[] =>
    timeRanges.slice().sort((a, b) => (a.start_min ?? 0) - (b.start_min ?? 0));

// This function handles null time ranges by filling in the missing days with null values
const handleNullTimeRanges = (intervals: TTimeRange[]): TTimeRange[] => {
    const finalIntervals: TTimeRange[] = [];
    for (let day = 0; day < 7; day++) {
        const dayStart = day * MINUTES_IN_DAY;
        const dayEnd = (day + 1) * MINUTES_IN_DAY;

        const foundInterval = intervals.find(
            interval =>
                interval.start_min !== null &&
                interval.end_min !== null &&
                interval.start_min >= dayStart &&
                interval.end_min <= dayEnd
        );

        if (foundInterval) {
            finalIntervals.push(foundInterval);
        } else {
            finalIntervals.push({ start_min: null, end_min: null });
        }
    }

    // Preserve any remaining intervals (overflow) and append null values as needed
    finalIntervals.forEach((interval, index) => {
        if (interval.start_min !== null && interval.end_min !== null) {
            finalIntervals[index] = interval;
        }
    });

    return finalIntervals;
};

/**
 * 
    This function splits the time ranges into intervals for each day of the week
    It also handles overflow and adjusts the time ranges based on the timezone offset
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

export const splitTimeRange = (timeRanges: TTimeRange[] = [], timezoneOffset: number): TTimeRange[] => {
    const intervals: TTimeRange[] = []; // Total minutes in a day

    // Handle the case where timeRanges is empty
    if (timeRanges.length === 0) {
        for (let day = 0; day < 7; day++) {
            intervals.push({
                start_min: day * MINUTES_IN_DAY,
                end_min: (day + 1) * MINUTES_IN_DAY,
            });
        }
        return intervals;
    }

    const sortedTimeRanges = getSortedTimeRanges(timeRanges);
    for (let day = 0; day < 7; day++) {
        const dayStart = day * MINUTES_IN_DAY; // Start of the day in minutes
        const dayEnd = (day + 1) * MINUTES_IN_DAY; // End of the day in minutes
        const overlappingRanges = sortedTimeRanges.filter(
            timeRange =>
                timeRange.start_min !== null &&
                timeRange.end_min !== null &&
                timeRange.start_min <= dayEnd &&
                timeRange.end_min > dayStart
        );

        overlappingRanges.forEach(overlappingRange => {
            let startMin = (overlappingRange.start_min as number) - timezoneOffset;
            const endMin = (overlappingRange.end_min as number) - timezoneOffset;

            // Handle overflow by splitting the range into multiple segments if necessary
            while (startMin < endMin) {
                const segmentStart = Math.max(dayStart, startMin);
                const segmentEnd = Math.min(dayEnd, endMin);

                if (segmentStart < segmentEnd) {
                    intervals.push({
                        start_min: segmentStart,
                        end_min: segmentEnd,
                    });
                }

                startMin = segmentEnd;

                // Break if the segment end is beyond the current day
                if (segmentEnd >= dayEnd) {
                    break;
                }
            }
        });

        // Add null values for days with no overlapping ranges
        if (overlappingRanges.length === 0) {
            intervals.push({
                start_min: null,
                end_min: null,
            });
        }
    }

    if (intervals.length < sortedTimeRanges.length) {
        if (timezoneOffset < 0 && intervals[0].start_min !== null) {
            intervals[0].start_min -= (sortedTimeRanges[7]?.end_min ?? 0) - (sortedTimeRanges[7]?.start_min ?? 0);
        } else if (timezoneOffset > 0 && intervals[6].end_min !== null) {
            intervals[6].end_min += (sortedTimeRanges[7]?.end_min ?? 0) - (sortedTimeRanges[7]?.start_min ?? 0);
        }
    }

    const result = handleNullTimeRanges(intervals);

    return result;
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
        if (start_min !== null && end_min !== null && end_min == start_min) {
            end_min = start_min + 1440;
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

export const isTimeEdited = (data: TBusinessDay[], edited_data: TBusinessDay[]): boolean => {
    if (data.length !== edited_data.length) {
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
export const getDropdownList = (hoursList: TTimeOption[], type: string, value: string) => {
    const referenceIndex = hoursList.findIndex(hour => hour.value === value);

    return hoursList.map((hour, index) => {
        let disabled = false;
        if (type === 'start' && index > referenceIndex) {
            disabled = true;
        } else if (type === 'end' && index < referenceIndex) {
            disabled = true;
        }

        return { ...hour, disabled };
    });
};
