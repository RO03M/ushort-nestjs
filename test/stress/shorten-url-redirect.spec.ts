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
const shortenedUrls: string[] = [];

function createShortenedUrl() {
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

	const shortenUrl = (responseBody as Record<string, string>)?.shortenedUrl ?? null;

	if (!shortenUrl) {
		return;
	}

	shortenedUrls.push(shortenUrl);
}

export function setup() {
	for (let i = 0; i < 60; i++) {
		createShortenedUrl();
	}
}

export default function () {
	const shortenUrl = shortenedUrls[Math.floor(Math.random() * shortenedUrls.length)];

	if (!shortenUrl) {
		createShortenedUrl();
		return;
	}
	const response = http.get(shortenUrl, { redirects: 0 });

	check(response, {
		"Http code is temporary redirect (307)": () => response.status === 307
	});
}
