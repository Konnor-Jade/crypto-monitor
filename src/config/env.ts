import dotenv from 'dotenv';
import { MonitorConfig } from '../types';

// 加载环境变量（强制覆盖已存在的环境变量）
dotenv.config({ override: true });

// 验证必需的环境变量
function validateEnv(): void {
  const required = ['RPC_URL', 'WATCH_ADDRESS'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`);
  }
}

// 获取配置
export function getConfig(): MonitorConfig {
  validateEnv();

  return {
    rpcUrl: process.env.RPC_URL!,
    watchAddresses: process.env.WATCH_ADDRESS!.split(',').map(addr => addr.trim()),
    notification: {
      type: (process.env.NOTIFICATION_TYPE as any) || 'console',
      enabled: true
    }
  };
}
