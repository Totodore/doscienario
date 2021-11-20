export { };
declare global {
  interface String {
    insert: (index: number, value: string) => string;
    delete: (from: number, length?: number) => string;
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
  }

  interface JSON {
    dateParser: (key: string, value: any) => any;
  }
}
export type Vector<T = number> = [T, T];
export type Vector3<T = number> = [T, T, T];