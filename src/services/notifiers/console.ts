import { BaseNotifier } from './base';
import { Transaction } from '../../types';
import { formatAddress, formatTimestamp, formatTxHash } from '../../utils/formatter';

/**
 * 控制台通知服务
 * 在终端中美化显示交易信息
 */
export class ConsoleNotifier extends BaseNotifier {
  private watchAddresses: Set<string>;

  constructor(watchAddresses: string[], enabled: boolean = true) {
    super(enabled);
    this.watchAddresses = new Set(watchAddresses.map(addr => addr.toLowerCase()));
  }

  /**
   * 发送交易通知到控制台
   */
  async notify(tx: Transaction, direction?: 'in' | 'out' | 'self'): Promise<void> {
    if (!this.enabled) return;

    // 如果没有提供方向，自动判断
    if (!direction) {
      direction = this.getDirection(tx);
    }

    const formattedMessage = this.formatTransaction(tx, direction);
    console.log(formattedMessage);
  }

  /**
   * 发送自定义消息到控制台
   */
  async sendMessage(message: string): Promise<void> {
    if (!this.enabled) return;
    console.log(message);
  }

  /**
   * 格式化交易信息
   */
  private formatTransaction(tx: Transaction, direction: 'in' | 'out' | 'self'): string {
    const directionIcon = this.getDirectionIcon(direction);
    const directionText = this.getDirectionText(direction);
    const directionColor = this.getDirectionColor(direction);

    const lines = [
      '',
      `${directionColor}╔${'═'.repeat(60)}╗\x1b[0m`,
      `${directionColor}║  ${directionIcon}  ${directionText.padEnd(54)}║\x1b[0m`,
      `${directionColor}╠${'═'.repeat(60)}╣\x1b[0m`,
      `${directionColor}║\x1b[0m  📝 交易哈希: ${formatTxHash(tx.hash).padEnd(45)} ${directionColor}║\x1b[0m`,
      `${directionColor}║\x1b[0m  💰 金额: ${tx.value.padEnd(50)} ETH ${directionColor}║\x1b[0m`,
      `${directionColor}║\x1b[0m  📤 发送方: ${formatAddress(tx.from).padEnd(47)} ${directionColor}║\x1b[0m`,
      `${directionColor}║\x1b[0m  📥 接收方: ${(tx.to ? formatAddress(tx.to) : '合约创建').padEnd(47)} ${directionColor}║\x1b[0m`,
      `${directionColor}║\x1b[0m  ⛽ Gas价格: ${tx.gasPrice.substring(0, 18).padEnd(45)} ETH ${directionColor}║\x1b[0m`,
      `${directionColor}║\x1b[0m  🔗 区块: ${tx.blockNumber.toLocaleString().padEnd(49)} ${directionColor}║\x1b[0m`,
      `${directionColor}║\x1b[0m  🕐 时间: ${formatTimestamp(tx.timestamp).padEnd(49)} ${directionColor}║\x1b[0m`,
      `${directionColor}╚${'═'.repeat(60)}╝\x1b[0m`,
      ''
    ];

    return lines.join('\n');
  }

  /**
   * 获取交易方向
   */
  private getDirection(tx: Transaction): 'in' | 'out' | 'self' {
    const from = tx.from.toLowerCase();
    const to = tx.to?.toLowerCase() || '';

    const isFromWatched = this.watchAddresses.has(from);
    const isToWatched = this.watchAddresses.has(to);

    if (isFromWatched && isToWatched) {
      return 'self';
    } else if (isToWatched) {
      return 'in';
    } else {
      return 'out';
    }
  }

  /**
   * 获取方向图标
   */
  private getDirectionIcon(direction: 'in' | 'out' | 'self'): string {
    switch (direction) {
      case 'in':
        return '📥';
      case 'out':
        return '📤';
      case 'self':
        return '🔄';
    }
  }

  /**
   * 获取方向文本
   */
  private getDirectionText(direction: 'in' | 'out' | 'self'): string {
    switch (direction) {
      case 'in':
        return '接收交易';
      case 'out':
        return '发送交易';
      case 'self':
        return '内部转账';
    }
  }

  /**
   * 获取方向颜色（ANSI颜色代码）
   */
  private getDirectionColor(direction: 'in' | 'out' | 'self'): string {
    switch (direction) {
      case 'in':
        return '\x1b[32m'; // 绿色
      case 'out':
        return '\x1b[33m'; // 黄色
      case 'self':
        return '\x1b[36m'; // 青色
    }
  }

  /**
   * 显示统计摘要
   */
  async showSummary(count: number, blockNumber: number): Promise<void> {
    if (!this.enabled) return;

    const message = `\n\x1b[1m\x1b[32m✓ 区块 #${blockNumber} - 发现 ${count} 笔相关交易\x1b[0m\n`;
    console.log(message);
  }
}
