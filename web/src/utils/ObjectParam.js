import { encodeObject, decodeObject } from 'use-query-params';

const ObjectParam = {
  encode: (obj) => encodeObject(obj, '->', '_'),
  decode: (objStr) => decodeObject(objStr, '->', '_'),
};

export default ObjectParam;
