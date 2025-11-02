import { Transaction } from '../../types';

/**
 * 通知服务接口
 * 所有通知服务（控制台、Telegram、邮件等）都需要实现此接口
 */
export interface INotifier {
  /**
   * 发送交易通知
   * @param tx 交易对象
   * @param direction 交易方向 'in' | 'out' | 'self'
   */
  notify(tx: Transaction, direction?: 'in' | 'out' | 'self'): Promise<void>;

  /**
   * 发送自定义消息
   * @param message 消息内容
   */
  sendMessage(message: string): Promise<void>;
}

/**
 * 通知服务抽象基类
 */
export abstract class BaseNotifier implements INotifier {
  protected enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  /**
   * 检查通知服务是否启用
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 启用通知服务
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * 禁用通知服务
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * 发送交易通知（需要子类实现）
   */
  abstract notify(tx: Transaction, direction?: 'in' | 'out' | 'self'): Promise<void>;

  /**
   * 发送自定义消息（需要子类实现）
   */
  abstract sendMessage(message: string): Promise<void>;
}
