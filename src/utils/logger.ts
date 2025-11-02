// 简单的日志工具类
export class Logger {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix ? `[${prefix}]` : '';
  }

  info(message: string, ...args: any[]): void {
    console.log(`${this.getTimestamp()} ${this.prefix} ℹ️  ${message}`, ...args);
  }

  success(message: string, ...args: any[]): void {
    console.log(`${this.getTimestamp()} ${this.prefix} ✅ ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`${this.getTimestamp()} ${this.prefix} ❌ ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`${this.getTimestamp()} ${this.prefix} ⚠️  ${message}`, ...args);
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }
}

// 导出默认实例
export const logger = new Logger('CryptoMonitor');
