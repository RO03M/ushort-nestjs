/**
 * Duration in milliseconds
 */
export enum Duration {
	Millisecond = 1,
	Second = Millisecond * 1000,
	Minute = Second * 60,
	Hour = Minute * 60,
	Day = Hour * 24,
	Month = Day * 31,
	Year = Day * 365
}

export async function sleep(ms: Duration | number = Duration.Minute) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
