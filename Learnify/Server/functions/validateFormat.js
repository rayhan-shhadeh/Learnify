export function isArrayOfJSONObjects(value) {
    if (!Array.isArray(value)) {
        return false;
    }
    return value.every(item => item && typeof item === 'object' && !(item instanceof Array));
}

export function isJSONObject(input) {
    try {
      if (typeof input === "string") {
        input = JSON.parse(input); // Try parsing the string
      }
      return typeof input === "object" && !Array.isArray(input) && input !== null;
    } catch (error) {
      return false; // Not a valid JSON
    }
}

export function isArrayOfStrings(param){
    if (Array.isArray(param) && param.every(p => typeof p === "string")) {
        return true;
    } else 
        return false;
}

