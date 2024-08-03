import { getI18nRegex } from "../setup";
import { createLogger } from "./create-logger";

export function checkRegex(source: string) {
    const i18nRegex = getI18nRegex();
    for (const [regex, value] of i18nRegex.entries()) {
        if (regex instanceof RegExp) {
            if (regex.test(source)) {
                const logger = createLogger();
                logger.log('regex', regex, source, value);
                return source.replace(regex, value);
            }
        } else {
            console.warn('Expected regex to be an instance of RegExp, but it was a string.');
        }
    }
    return source;
}
