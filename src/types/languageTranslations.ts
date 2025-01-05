// To parse this data:
//
//   import { Convert, LanguageTranslations } from "./file";
//
//   const languageTranslations = Convert.toLanguageTranslations(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface LanguageTranslations {
  status: Status;
  actions: Actions;
  entities: Entities;
  attributes: Attributes;
  auth: Auth;
  validation: Validation;
  file: File;
  error: Error;
}

export interface Actions {
  register: string;
  login: string;
  refreshToken: string;
  upload: string;
  add: string;
  update: string;
  delete: string;
}

export interface Attributes {
  expiresAt: string;
  discountValue: string;
}

export interface Auth {
  invalidCredentials: string;
  noAccessToken: string;
  invalidOrExpiredToken: string;
  unauthorized: string;
  userExists: string;
}

export interface Entities {
  user: string;
  product: string;
  category: string;
  file: string;
  adjustmentType: string;
  productAttribute: string;
  tax: string;
  favorite: string;
  cart: string;
  cartItem: string;
  order: string;
}

export interface Error {
  serverError: string;
  databaseError: string;
}

export interface File {
  notProvided: string;
}

export interface Status {
  success: string;
  fail: string;
  notFound: string;
  alreadyExists: string;
  invalid: string;
  empty: string;
}

export interface Validation {
  validationError: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toLanguageTranslations(json: string): LanguageTranslations {
    return cast(JSON.parse(json), r('LanguageTranslations'));
  }

  public static languageTranslationsToJson(
    value: LanguageTranslations
  ): string {
    return JSON.stringify(uncast(value, r('LanguageTranslations')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = '',
  parent: any = ''
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty('props')
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  LanguageTranslations: o(
    [
      { json: 'status', js: 'status', typ: r('Status') },
      { json: 'actions', js: 'actions', typ: r('Actions') },
      { json: 'entities', js: 'entities', typ: r('Entities') },
      { json: 'attributes', js: 'attributes', typ: r('Attributes') },
      { json: 'auth', js: 'auth', typ: r('Auth') },
      { json: 'validation', js: 'validation', typ: r('Validation') },
      { json: 'file', js: 'file', typ: r('File') },
      { json: 'error', js: 'error', typ: r('Error') },
    ],
    false
  ),
  Actions: o(
    [
      { json: 'register', js: 'register', typ: '' },
      { json: 'login', js: 'login', typ: '' },
      { json: 'refreshToken', js: 'refreshToken', typ: '' },
      { json: 'upload', js: 'upload', typ: '' },
      { json: 'add', js: 'add', typ: '' },
      { json: 'update', js: 'update', typ: '' },
      { json: 'delete', js: 'delete', typ: '' },
    ],
    false
  ),
  Attributes: o(
    [
      { json: 'expiresAt', js: 'expiresAt', typ: '' },
      { json: 'discountValue', js: 'discountValue', typ: '' },
    ],
    false
  ),
  Auth: o(
    [
      { json: 'invalidCredentials', js: 'invalidCredentials', typ: '' },
      { json: 'noAccessToken', js: 'noAccessToken', typ: '' },
      { json: 'invalidOrExpiredToken', js: 'invalidOrExpiredToken', typ: '' },
      { json: 'unauthorized', js: 'unauthorized', typ: '' },
      { json: 'userExists', js: 'userExists', typ: '' },
    ],
    false
  ),
  Entities: o(
    [
      { json: 'user', js: 'user', typ: '' },
      { json: 'product', js: 'product', typ: '' },
      { json: 'category', js: 'category', typ: '' },
      { json: 'file', js: 'file', typ: '' },
      { json: 'adjustmentType', js: 'adjustmentType', typ: '' },
      { json: 'productAttribute', js: 'productAttribute', typ: '' },
      { json: 'tax', js: 'tax', typ: '' },
      { json: 'favorite', js: 'favorite', typ: '' },
      { json: 'cart', js: 'cart', typ: '' },
      { json: 'cartItem', js: 'cartItem', typ: '' },
      { json: 'order', js: 'order', typ: '' },
    ],
    false
  ),
  Error: o(
    [
      { json: 'serverError', js: 'serverError', typ: '' },
      { json: 'databaseError', js: 'databaseError', typ: '' },
    ],
    false
  ),
  File: o([{ json: 'notProvided', js: 'notProvided', typ: '' }], false),
  Status: o(
    [
      { json: 'success', js: 'success', typ: '' },
      { json: 'fail', js: 'fail', typ: '' },
      { json: 'notFound', js: 'notFound', typ: '' },
      { json: 'alreadyExists', js: 'alreadyExists', typ: '' },
      { json: 'invalid', js: 'invalid', typ: '' },
      { json: 'empty', js: 'empty', typ: '' },
    ],
    false
  ),
  Validation: o(
    [{ json: 'validationError', js: 'validationError', typ: '' }],
    false
  ),
};
