interface CustomConsole extends Console {
  init: (label: string) => void;
}

export function createLogger(): CustomConsole {
  const loggerTimerMap = new Map<string, number>();
  const loggerConf = { badge: true, label: 'Logger', enable: false };

  return new Proxy(console, {
    get: (target, propKey) => {
      if (propKey === 'init') {
        return (label: string) => {
          loggerConf.label = label;
          loggerConf.enable = true;
        };
      }

      if (!(propKey in target)) return undefined;

      return (...args: any[]) => {
        if (!loggerConf.enable) return;

        let color = ['#39cfe1', '#006cab'];

        let label: string, start: number | undefined;
        switch (propKey) {
          case 'error':
            color = ['#f70000', '#a70000'];
            break;
          case 'warn':
            color = ['#f7b500', '#b58400'];
            break;
          case 'time':
            label = args[0];
            if (loggerTimerMap.has(label)) {
              console.warn(`Timer '${label}' already exists`);
            } else {
              loggerTimerMap.set(label, performance.now());
            }
            return;
          case 'timeEnd':
            label = args[0];
            start = loggerTimerMap.get(label);
            if (start === undefined) {
              console.warn(`Timer '${label}' does not exist`);
            } else {
              loggerTimerMap.delete(label);
              console.log(`${label}: ${performance.now() - start} ms`);
            }
            return;
          case 'groupEnd':
            loggerConf.badge = true;
            break;
        }

        const badge = loggerConf.badge
          ? [`%c${loggerConf.label}`, `color: #fff; background: linear-gradient(180deg, ${color[0]}, ${color[1]}); text-shadow: 0px 0px 1px #0003; padding: 3px 5px; border-radius: 4px;`]
          : [];

        (target as any)[propKey](...badge, ...args);

        if (propKey === 'group' || propKey === 'groupCollapsed') {
          loggerConf.badge = false;
        }
      };
    }
  }) as CustomConsole;
}