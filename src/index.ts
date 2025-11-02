import { getConfig } from './config/env';
import { logger } from './utils/logger';

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

    // 后续步骤会在这里添加区块链监听逻辑
    logger.info('系统初始化完成，准备开始监控...');

  } catch (error) {
    logger.error('启动失败:', error);
    process.exit(1);
  }
}

// 运行主程序
main();
