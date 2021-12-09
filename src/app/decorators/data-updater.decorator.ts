
export function DataUpdater() {
  return function (target: any, key: any, descriptor: any) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const result = original.apply(this, args);
      if (result instanceof Promise) {
        result.then(() => {
          this.saveData();
          this.searchComponent.search();
        });
      } else {
        this.saveData();
        this.searchComponent.search();
      }
    };
    return descriptor;
  }
}