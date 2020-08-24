// export {};

// declare global {
declare namespace Express {
	interface Session {
		userId: string;
	}
}
// }
