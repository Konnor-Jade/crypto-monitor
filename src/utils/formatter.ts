import { ethers } from 'ethers';

// 格式化以太坊地址（缩短显示）
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 格式化ETH金额
export function formatEther(wei: string | bigint): string {
  return ethers.formatEther(wei);
}

// 格式化时间戳
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('zh-CN');
}

// 格式化交易哈希（缩短显示）
export function formatTxHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
