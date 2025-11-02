import { ethers } from 'ethers';
import { Transaction } from '../types';
import { logger } from '../utils/logger';
import { formatAddress, formatEther, formatTxHash } from '../utils/formatter';

/**
 * 交易监控服务类
 * 负责扫描区块、过滤交易、解析交易详情
 */
export class TransactionMonitor {
  private provider: ethers.JsonRpcProvider;
  private watchAddresses: Set<string>;

  constructor(provider: ethers.JsonRpcProvider, watchAddresses: string[]) {
    this.provider = provider;
    // 使用 Set 并转为小写，提高查询效率
    this.watchAddresses = new Set(watchAddresses.map(addr => addr.toLowerCase()));
  }

  /**
   * 扫描指定区块中的所有交易
   * @param blockNumber 区块号
   * @returns 与监控地址相关的交易列表
   */
  async scanBlock(blockNumber: number): Promise<Transaction[]> {
    try {
      // 获取区块及其所有交易
      const block = await this.provider.getBlock(blockNumber, true);

      if (!block) {
        logger.warn(`区块 ${blockNumber} 不存在`);
        return [];
      }

      // 如果区块没有交易，直接返回
      if (!block.transactions || block.transactions.length === 0) {
        return [];
      }

      const relevantTransactions: Transaction[] = [];

      // 遍历区块中的所有交易
      for (const txHash of block.transactions) {
        // 获取交易详情
        const tx = await this.provider.getTransaction(txHash as string);

        if (!tx) continue;

        // 检查交易是否与监控地址相关
        if (this.isRelevantTransaction(tx)) {
          const parsedTx = this.parseTransaction(tx, block.timestamp);
          relevantTransactions.push(parsedTx);
        }
      }

      return relevantTransactions;
    } catch (error) {
      logger.error(`扫描区块 ${blockNumber} 失败:`, error);
      return [];
    }
  }

  /**
   * 检查交易是否与监控地址相关
   * @param tx 交易对象
   * @returns 是否相关
   */
  private isRelevantTransaction(tx: ethers.TransactionResponse): boolean {
    const from = tx.from.toLowerCase();
    const to = tx.to?.toLowerCase() || '';

    // 检查发送方或接收方是否在监控列表中
    return this.watchAddresses.has(from) || this.watchAddresses.has(to);
  }

  /**
   * 解析交易详情
   * @param tx 交易对象
   * @param blockTimestamp 区块时间戳
   * @returns 格式化的交易信息
   */
  private parseTransaction(
    tx: ethers.TransactionResponse,
    blockTimestamp: number
  ): Transaction {
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to || null,
      value: formatEther(tx.value),
      gasPrice: tx.gasPrice ? formatEther(tx.gasPrice) : '0',
      gasLimit: tx.gasLimit.toString(),
      blockNumber: tx.blockNumber || 0,
      timestamp: blockTimestamp
    };
  }

  /**
   * 判断交易方向
   * @param tx 交易对象
   * @param address 监控地址
   * @returns 'in' | 'out' | 'self'
   */
  getTransactionDirection(tx: Transaction, address: string): 'in' | 'out' | 'self' {
    const normalizedAddress = address.toLowerCase();
    const from = tx.from.toLowerCase();
    const to = tx.to?.toLowerCase() || '';

    if (from === normalizedAddress && to === normalizedAddress) {
      return 'self';
    } else if (to === normalizedAddress) {
      return 'in';
    } else {
      return 'out';
    }
  }

  /**
   * 格式化交易信息用于显示
   * @param tx 交易对象
   * @returns 格式化的字符串
   */
  formatTransactionInfo(tx: Transaction): string {
    const lines = [
      '',
      '🔔 检测到新交易！',
      '━'.repeat(50),
      `📝 交易哈希: ${formatTxHash(tx.hash)}`,
      `💰 金额: ${tx.value} ETH`,
      `📤 发送方: ${formatAddress(tx.from)}`,
      `📥 接收方: ${tx.to ? formatAddress(tx.to) : '合约创建'}`,
      `⛽ Gas价格: ${tx.gasPrice} ETH`,
      `🔗 区块: ${tx.blockNumber.toLocaleString()}`,
      `🕐 时间: ${new Date(tx.timestamp * 1000).toLocaleString('zh-CN')}`,
      '━'.repeat(50),
      ''
    ];

    return lines.join('\n');
  }
}
