// 交易信息类型
export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasLimit: string;
  blockNumber: number;
  timestamp: number;
}

// 通知配置类型
export interface NotificationConfig {
  type: 'console' | 'telegram' | 'email';
  enabled: boolean;
}

// 监控配置类型
export interface MonitorConfig {
  watchAddresses: string[];
  rpcUrl: string;
  notification: NotificationConfig;
}
