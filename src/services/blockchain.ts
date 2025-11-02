import { ethers } from 'ethers';
import { logger } from '../utils/logger';

/**
 * 区块链服务类
 * 负责连接以太坊节点、获取区块信息、监听新区块
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private isConnected: boolean = false;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * 连接到以太坊节点并验证连接
   */
  async connect(): Promise<void> {
    try {
      logger.info('正在连接到以太坊节点...');

      // 获取网络信息验证连接
      const network = await this.provider.getNetwork();
      logger.success(`✓ 已连接到网络: ${network.name} (Chain ID: ${network.chainId})`);

      // 获取当前区块高度
      const blockNumber = await this.provider.getBlockNumber();
      logger.info(`当前区块高度: ${blockNumber.toLocaleString()}`);

      this.isConnected = true;
    } catch (error) {
      logger.error('连接以太坊节点失败:', error);
      throw error;
    }
  }

  /**
   * 获取最新区块号
   */
  async getLatestBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      logger.error('获取最新区块号失败:', error);
      throw error;
    }
  }

  /**
   * 获取指定区块的完整信息
   */
  async getBlock(blockNumber: number): Promise<ethers.Block | null> {
    try {
      return await this.provider.getBlock(blockNumber, true); // true表示包含交易详情
    } catch (error) {
      logger.error(`获取区块 ${blockNumber} 信息失败:`, error);
      throw error;
    }
  }

  /**
   * 监听新区块事件
   * @param callback 每当有新区块时调用的回调函数
   */
  onNewBlock(callback: (blockNumber: number) => void): void {
    if (!this.isConnected) {
      throw new Error('请先调用 connect() 连接到以太坊节点');
    }

    logger.info('开始监听新区块...');

    this.provider.on('block', (blockNumber: number) => {
      logger.info(`检测到新区块: ${blockNumber}`);
      callback(blockNumber);
    });
  }

  /**
   * 停止监听区块
   */
  stopListening(): void {
    this.provider.removeAllListeners('block');
    logger.warn('已停止监听新区块');
  }

  /**
   * 检查连接状态
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * 获取provider实例（用于其他高级操作）
   */
  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }
}
