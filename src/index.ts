import { getConfig } from './config/env';
import { logger } from './utils/logger';
import { BlockchainService } from './services/blockchain';
import { TransactionMonitor } from './services/monitor';
import { ConsoleNotifier } from './services/notifiers';

async function main() {
  try {
    logger.info('🚀 启动加密货币监控系统...');

    // 加载配置
    const config = getConfig();
    logger.success('✓ 配置加载成功');
    logger.info(`监控地址: ${config.watchAddresses.join(', ')}`);

    // 隐藏API密钥的部分URL显示
    const rpcDisplay = config.rpcUrl.length > 50
      ? `${config.rpcUrl.slice(0, 45)}...${config.rpcUrl.slice(-8)}`
      : config.rpcUrl;
    logger.info(`RPC URL: ${rpcDisplay}`);
    logger.info(`通知方式: ${config.notification.type}`);

    // 初始化区块链服务
    const blockchain = new BlockchainService(config.rpcUrl);
    await blockchain.connect();

    // 初始化交易监控服务
    const monitor = new TransactionMonitor(
      blockchain.getProvider(),
      config.watchAddresses
    );

    // 初始化通知服务
    const notifier = new ConsoleNotifier(config.watchAddresses, config.notification.enabled);

    logger.success('✓ 系统初始化完成！');
    logger.info('━'.repeat(50));

    // 开始监听新区块
    blockchain.onNewBlock(async (blockNumber) => {
      logger.info(`📦 新区块 #${blockNumber} - 正在扫描交易...`);

      // 扫描区块中的交易
      const transactions = await monitor.scanBlock(blockNumber);

      if (transactions.length > 0) {
        // 显示统计摘要
        await notifier.showSummary(transactions.length, blockNumber);

        // 发送每笔交易的通知
        for (const tx of transactions) {
          await notifier.notify(tx);
        }
      }
    });

    logger.info('🔍 监控系统运行中... (按 Ctrl+C 退出)');

  } catch (error) {
    logger.error('启动失败:', error);
    process.exit(1);
  }
}

// 运行主程序
main();
