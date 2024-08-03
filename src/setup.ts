import { readFile } from "./lib/read-files";
import { getRegex } from "./lib/get-regax";
import { createLogger } from "./lib/create-logger";
import { opts } from "./config/opts";
import { handleDropdown } from "./lib/handle-dropdown";
import { translatePage } from "./lib/tranlate-page";

interface Config {
    enabled: boolean;
    file: string;
    dirs: string;
    order: string;
    enableLogger: boolean;
}

let i18n = null;
const i18nRegex = new Map<string | RegExp, any>();
const i18nScope = {};
const scopedSource = {};
let config: Config | null = null;

export function setup() {
    config = {
        enabled: opts.bilingual_localization_enabled,
        file: opts.bilingual_localization_file,
        dirs: opts.bilingual_localization_dirs,
        order: opts.bilingual_localization_order,
        enableLogger: opts.bilingual_localization_logger,
    };

    let { enabled, file, dirs, enableLogger } = config;

    if (!enabled || file === "None" || dirs === "None") return;
    const dirsParsed = JSON.parse(dirs);

    const logger = createLogger();
    if (enableLogger) {
        logger.init('Bilingual');
    }
    logger.log('Bilingual Localization initialized.');

    // Load localization file
    const regex_scope = /^##(?<scope>.+)##(?<skey>.+)$/; // ##scope##.skey
    i18n = JSON.parse(readFile(dirsParsed[file]), (key, value) => {
        // parse regex translations
        if (key.startsWith('@@')) {
            const regex = getRegex(key.slice(2));
            if (regex instanceof RegExp) {
                i18nRegex.set(regex, value);
            }
        } else {
            const match = key.match(regex_scope);
            if (match && match.groups) {
                // parse scope translations
                let { scope, skey } = match.groups;

                if (scope.startsWith('@')) {
                    scope = scope.slice(1);
                } else {
                    scope = '#' + scope;
                }

                if (!scope.length) {
                    return value;
                }

                i18nScope[scope] ||= {};
                i18nScope[scope][skey] = value;

                scopedSource[skey] ||= [];
                scopedSource[skey].push(scope);
            } else {
                return value;
            }
        }
    });
    translatePage()
    handleDropdown()
}

export function getI18n() {
    return i18n;
}

export function getI18nRegex() {
    return i18nRegex;
}

export function getI18nScope() {
    return i18nScope;
}

export function getScopedSource() {
    return scopedSource;
}

export function getConfig() {
    return config;
}
