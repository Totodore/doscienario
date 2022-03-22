export { };
declare global {
  interface String {
    insert: (index: number, value: string) => string;
    delete: (from: number, length?: number) => string;
    capitalize: () => string;
  }

  interface Array<T> {
    equals<T>(this: Array<T>, array1: Array<T>): boolean;
    insert<T>(this: Array<T>, index: number, item: T): void;
    // includes<T>(this: Array<T>, el: T, custom?: (el: T, arr) => ): boolean;
  }

  interface HTMLElement {
    scrollTopMax: number;
    scrollLeftMax: number;
    isMaxScrollTop: boolean;
    isMaxScrollLeft: boolean;
  }

  interface Math {
    factorial(num: number): number;
    clamp(num: number, min: number, max: number): number;
  }

  interface JSON {
    dateParser: (key: string, value: any) => any;
  }
  interface Object {
    fromEntries<T>(this: Object, entries: [string, T][]): { [key: string]: T };
  }
}
export type Vector4<T = number> = [T, T, T, T];
export type Vector3<T = number> = [T, T, T];
export type Vector2<T = number> = [T, T];
export type Vector<T = number> = Vector2<T>;