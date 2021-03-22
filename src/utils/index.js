export function emptyObject(object) {
  for (const key in object) {
    return false;
  }
  return true;
}

export function convertProvide(provide = [], defaults = {}, key) {
  if (Array.isArray(provide)) {
    if (key === undefined) {
      const result = {};

      provide.forEach(item => {
        result[item] = {
          key: item,
          as: item,
          allowSet: false,
          ...defaults
        };
      });

      return result;
    } else {
      let result = null;

      provide.some(item => {
        if (item === key) {
          result = {
            key: item,
            as: item,
            allowSet: false,
            ...defaults
          };
          return true;
        }
      });

      return result;
    }
  } else {
    if (key === undefined) {
      const result = {};
      for (const key in provide) {
        if (typeof provide[key] === "object") {
          result[key] = {
            as: key,
            allowSet: false,
            ...defaults,
            ...provide[key],
            key
          };
        } else {
          result[key] = {
            key,
            as: provide[key],
            allowSet: false,
            ...defaults
          };
        }
      }
      return result;
    } else {
      for (const key2 in provide) {
        let thisProvide =
          typeof provide[key2] === "object"
            ? {
                as: key2,
                allowSet: false,
                ...defaults,
                ...provide[key2],
                key: key2
              }
            : {
                key: key2,
                as: provide[key2],
                allowSet: false,
                ...defaults
              };
        if (thisProvide.as === key) {
          return thisProvide;
        } else {
          thisProvide = undefined;
        }
      }
      return null;
    }
  }
}

export function covertInject(inject = [], defaults = {}) {
  const result = {};
  if (Array.isArray(inject)) {
    inject.forEach(item => {
      result[item] = {
        key: item,
        as: item,
        allowEmit: false,
        ...defaults
      };
    });
  } else {
    for (const key in inject) {
      if (typeof inject[key] === "object") {
        result[key] = {
          key,
          as: key,
          allowEmit: false,
          ...defaults,
          ...inject[key]
        };
      } else {
        result[key] = {
          key,
          as: inject[key],
          allowEmit: false,
          ...defaults
        };
      }
    }
  }

  return result;
}

/// not accept get
