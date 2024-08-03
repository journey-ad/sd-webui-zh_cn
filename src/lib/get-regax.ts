// get regex object from string
export function getRegex(regex) {
        try {
          regex = regex.trim();
          let parts = regex.split('/');
          if (regex[0] !== '/' || parts.length < 3) {
            regex = regex.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); //escap common string
            return new RegExp(regex);
          }
    
          const option = parts[parts.length - 1];
          const lastIndex = regex.lastIndexOf('/');
          regex = regex.substring(1, lastIndex);
          return new RegExp(regex, option);
        } catch (e) {
          return null
        }
      }