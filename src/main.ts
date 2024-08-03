import { init } from './init';
interface I18n {
  [key: string]: string;
}

interface I18nScope {
  [scope: string]: I18n;
}

interface ScopedSource {
  [source: string]: string[];
}

interface Config {
  enabled: boolean;
  file: string;
  dirs: string[];
  order: string;
  enableLogger: boolean;
}

let i18n: I18n | null = null;
let i18nRegex: Map<RegExp, string> = new Map();
let i18nScope: I18nScope = {};
let scopedSource: ScopedSource = {};
let config: Config | null = null;

// DOMContentLoaded イベント発生後に初期化処理を実行
document.addEventListener('DOMContentLoaded', () => {
    init()
});
