export function genRandomChars(length: number) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const hash: string[] = [];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        hash.push(chars.charAt(randomIndex));
    }

    return hash.join("");
}