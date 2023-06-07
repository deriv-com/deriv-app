const suspend = (value: number) => new Promise(resolve => setTimeout(resolve, value));

export default suspend;
