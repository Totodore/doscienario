export { };
declare global {
  interface String {
    insert: (index: number, value: string) => string;
    delete: (from: number, length?: number) => string;
  }

  interface Array<T> {
    equals<T>(this: Array<T>, array1: Array<T>): boolean;
  }

  interface HTMLElement {
    scrollTopMax: number;
    scrollLeftMax: number;
    isMaxScrollTop: boolean;
    isMaxScrollLeft: boolean;
  }
}
