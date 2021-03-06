/**
 * Async Lock class
 * Lock async function to run once
 *
 * @class AsyncLock
 */
class AsyncLock {
  constructor() {
    this.inProcess = false;
    this.queue = [];
  }

  /**
   * Start lock function
   *
   * @returns
   * @memberof AsyncLock
   */
  async acquire() {
    if (!this.inProcess) {
      this.inProcess = true;
      return true;
    }

    return new Promise(resolver => this.queue.push(resolver));
  }

  /**
   * Release lock and return result to all queue
   *
   * @param {boolean} [result=true]
   * @memberof AsyncLock
   */
  release(result = true) {
    this.inProcess = false;
    
    while (this.queue.length > 0) {
      const resolver = this.queue.shift();
      resolver(result);
    }
  }
}

module.exports = AsyncLock;
