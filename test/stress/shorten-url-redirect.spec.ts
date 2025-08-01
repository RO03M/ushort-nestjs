import { check } from "k6";
import http from "k6/http";

export const options = {
	vus: 500, // Maximum number of virtual users
	// duration: "2m", // Total duration of the test
	thresholds: {
		http_req_duration: ["p(95)<200"]
		// failed_requests: ["rate<0.1"] // Less than 10% of requests should fail
	},
	stages: [
		{ duration: "1m", target: 15 }, // Ramp up to 100 users over 2 minutes
		{ duration: "1m", target: 150 }, // Stay at 100 users for 5 minutes
		{ duration: "1m", target: 500 }, // Ramp up to 200 users over 2 minutes
		{ duration: "2m", target: 400 } // Ramp up to 200 users over 2 minutes
	]
};

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export function setup() {
	const commonUrl = "https://google.com";
	const body = {
		longUrl: commonUrl
	};

	const response = http.post(`${BASE_URL}/urls`, body);
	const responseBody = response.json();

	check(response, {
		"Response was 2xx": (response) => response.status >= 200 && response.status < 300,
		"An url object was returned": () => {
			return responseBody !== null && typeof responseBody === "object" && !Array.isArray(responseBody) && "url" in responseBody && "shortenedUrl" in responseBody;
		}
	});

	return (responseBody as Record<string, unknown>)?.shortenedUrl ?? "";
}

export default function (shortenUrl: string) {
	const response = http.get(shortenUrl);
	console.log(response.status, response.status_text);
	// check(response, {
	// 	""
	// })
	// const randomId = Math.floor(Math.random() * 15) + 1;
	// const body = {
	// 	id: randomId
	// };

	// http.post(`${BASE_URL}/rojasbicha`, JSON.stringify(body), {
	// 	headers: { "Content-Type": "application/json" }
	// });
}
