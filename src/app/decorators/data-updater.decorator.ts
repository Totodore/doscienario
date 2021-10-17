
export function DataUpdater() {
  return function (target: any, key: any, descriptor: any) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const result = original.apply(this, args);
      console.log(this);
      if (result instanceof Promise) {
        result.then(() => {
          this.saveData();
          this.updateSearch();
        });
      } else {
        this.saveData();
        this.updateSearch();
      }
    };
    return descriptor;
  }
}