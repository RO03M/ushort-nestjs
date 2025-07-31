import http from "k6/http";

export const options = {
	vus: 150, // Maximum number of virtual users
	// duration: "2m", // Total duration of the test
	thresholds: {
		http_req_duration: ["p(95)<1000"] // 95% of requests should be below 1000ms
		// failed_requests: ["rate<0.1"] // Less than 10% of requests should fail
	},
	stages: [
		{ duration: "1m", target: 15 }, // Ramp up to 100 users over 2 minutes
		{ duration: "1m", target: 50 }, // Stay at 100 users for 5 minutes
		{ duration: "1m", target: 150 }, // Ramp up to 200 users over 2 minutes
		{ duration: "2m", target: 10 } // Ramp up to 200 users over 2 minutes
	]
};

const PORT = 9999;
const BASE_URL = `http://localhost:${PORT}`;

export default function () {
	const randomId = Math.floor(Math.random() * 15) + 1;
	const body = {
		id: randomId
	};

	http.post(`${BASE_URL}/queue`, JSON.stringify(body), {
		headers: { "Content-Type": "application/json" }
	});
}
