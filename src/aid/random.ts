export function generateUniqueString(length:number) {
    const timestamp = new Date().getTime().toString(36);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const randomChars = [];
    const usedChars = new Set();

    // 生成随机字符串
    for (let i = 0; i < length - 5; i++) {
        let char;
        do {
            char = characters.charAt(Math.floor(Math.random() * charactersLength));
        } while (usedChars.has(char));
        randomChars.push(char);
        usedChars.add(char);
    }

    const randomString = randomChars.join('');

    return timestamp + randomString;
}