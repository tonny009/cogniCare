const pick = <T extends Record<string, unknown>, k extends keyof T>(obj: T, keys: k[]): Partial<T> => {
   //here we defined obj type as T and keys type as k which is a subset of T's keys. 
   // T type involves string and other unknown types as object values
   // The function will return an object that has only the properties of T that are specified in the keys array.
    const finalObject: Partial<T> = {};

    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key]
        }
    }

    return finalObject;
}

export default pick;