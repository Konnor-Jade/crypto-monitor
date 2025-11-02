# 加密货币交易监控与通知系统 - 项目规划

## 项目概述

一个基于Node.js + TypeScript的实时以太坊交易监控系统，用于监控特定地址或智能合约的交易活动，并通过多种方式发送通知。

## 技术栈

- **运行时**: Node.js
- **语言**: TypeScript
- **区块链库**: ethers.js v6
- **环境变量**: dotenv
- **开发工具**: ts-node, nodemon

## 当前进度

✅ **步骤1：基础设置** - 已完成
- TypeScript配置
- 项目结构搭建
- 环境变量配置
- 日志和格式化工具

---

## 开发路线图

### 第一阶段：基础监控功能（MVP）

#### 步骤2：区块链连接服务
**文件**: `src/services/blockchain.ts`

功能：
- 连接到以太坊RPC节点（Alchemy）
- 测试连接状态
- 获取最新区块信息
- 监听新区块事件

核心代码结构：
```typescript
class BlockchainService {
  - provider: ethers.JsonRpcProvider
  + connect(): Promise<void>
  + getLatestBlock(): Promise<number>
  + onBlock(callback): void
}
```

#### 步骤3：交易监控逻辑
**文件**: `src/services/monitor.ts`

功能：
- 扫描区块中的所有交易
- 过滤目标地址相关的交易
- 解析交易详情（from, to, value, gas等）
- 区分转入/转出交易

核心逻辑：
```typescript
class TransactionMonitor {
  + scanBlock(blockNumber): Promise<Transaction[]>
  + filterTransactions(txs, addresses): Transaction[]
  + parseTransaction(tx): Transaction
}
```

#### 步骤4：控制台通知服务
**文件**: `src/services/notifier.ts`

功能：
- 美化输出交易信息
- 显示关键字段（时间、地址、金额、hash）
- 支持不同通知类型的接口设计

输出示例：
```
🔔 检测到新交易！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 交易哈希: 0x1234...5678
💰 金额: 1000.5 ETH
📤 发送方: 0xabcd...ef01
📥 接收方: 0x9876...4321
⛽ Gas费用: 0.002 ETH
🕐 时间: 2025-11-02 10:30:45
🔗 区块: 18,234,567
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 步骤5：整合主程序
**文件**: `src/index.ts`

功能：
- 初始化所有服务
- 启动监听循环
- 错误处理和重连机制
- 优雅退出

#### 步骤6：测试基础功能
- 监控Vitalik地址或USDT合约
- 验证交易检测准确性
- 测试长时间运行稳定性

---

### 第二阶段：功能增强

#### 步骤7：ERC-20代币支持
**文件**: `src/services/tokenParser.ts`

功能：
- 解析ERC-20 Transfer事件
- 识别代币类型（USDT, USDC, DAI等）
- 显示代币金额和符号
- 支持多种代币同时监控

新增类型：
```typescript
interface TokenTransfer {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  from: string;
  to: string;
  amount: string;
  decimals: number;
}
```

#### 步骤8：交易过滤器
**文件**: `src/services/filter.ts`

功能：
- 按金额范围过滤
- 按交易类型过滤（转入/转出/合约调用）
- 按代币类型过滤
- 自定义过滤规则

配置示例：
```typescript
interface FilterConfig {
  minAmount?: string;  // 最小金额
  maxAmount?: string;  // 最大金额
  direction?: 'in' | 'out' | 'all';  // 方向
  tokenTypes?: string[];  // 代币类型
}
```

#### 步骤9：多地址监控
**更新**: `src/config/env.ts`, `src/types/index.ts`

功能：
- 支持监控多个地址
- 为每个地址设置别名
- 地址分组管理
- 批量导入地址

配置格式：
```env
WATCH_ADDRESSES=0x123...,0x456...,0x789...
ADDRESS_LABELS=Vitalik,USDT,Binance
```

#### 步骤10：历史交易查询
**文件**: `src/services/history.ts`

功能：
- 查询指定地址的历史交易
- 按时间范围查询
- 导出为JSON/CSV格式
- 交易统计分析

命令行参数：
```bash
yarn query --address=0x123... --from=2025-01-01 --to=2025-11-02
```

---

### 第三阶段：通知扩展

#### 步骤11：Telegram Bot通知
**文件**: `src/services/notifiers/telegram.ts`

依赖：
```bash
yarn add node-telegram-bot-api @types/node-telegram-bot-api
```

功能：
- 创建Telegram Bot
- 推送交易通知
- 支持Markdown格式
- 添加查看详情链接（Etherscan）

环境变量：
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

#### 步骤12：邮件通知
**文件**: `src/services/notifiers/email.ts`

依赖：
```bash
yarn add nodemailer @types/nodemailer
```

功能：
- SMTP邮件发送
- HTML格式邮件模板
- 批量通知（每小时汇总）
- 邮件防spam限流

环境变量：
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=recipient@example.com
```

#### 步骤13：Webhook通知
**文件**: `src/services/notifiers/webhook.ts`

依赖：
```bash
yarn add axios
```

功能：
- POST请求发送交易数据
- 自定义请求头和认证
- 重试机制
- 对接Discord/Slack等

配置：
```env
WEBHOOK_URL=https://your-server.com/webhook
WEBHOOK_SECRET=your_secret_key
```

#### 步骤14：通知管理器
**文件**: `src/services/notificationManager.ts`

功能：
- 统一管理所有通知方式
- 根据配置启用/禁用通知
- 通知优先级和去重
- 通知失败重试

---

### 第四阶段：高级特性

#### 步骤15：数据持久化
**文件**: `src/services/database.ts`

方案选择：
- **轻量级**: SQLite（适合个人使用）
- **生产级**: PostgreSQL（适合大规模监控）

功能：
- 存储所有交易记录
- 查询历史数据
- 生成统计报表
- 数据备份和恢复

#### 步骤16：Web界面（可选）
**新目录**: `src/web/`

技术栈：
- Express.js（后端API）
- 静态HTML/CSS/JS或React（前端）

功能：
- 实时交易展示
- 历史数据查询
- 监控配置管理
- 交易统计图表

#### 步骤17：智能合约事件监听
**文件**: `src/services/contractMonitor.ts`

功能：
- 监听特定合约事件（Transfer, Approval等）
- 解析事件参数
- DEX交易监控（Uniswap, SushiSwap等）
- NFT交易监控（OpenSea）

示例：
```typescript
// 监听Uniswap V2 Swap事件
contract.on('Swap', (sender, amount0In, amount1In, amount0Out, amount1Out) => {
  // 处理DEX交易
});
```

#### 步骤18：价格监控
**文件**: `src/services/priceTracker.ts`

依赖：
```bash
yarn add axios
```

功能：
- 获取实时代币价格（CoinGecko/CoinMarketCap API）
- 价格变动告警
- 计算交易USD价值
- 价格图表数据

#### 步骤19：Gas优化和批处理
**文件**: `src/services/optimizer.ts`

功能：
- 批量处理区块扫描
- 并发请求优化
- RPC请求缓存
- 减少API调用次数

优化技术：
- 使用`eth_getLogs`批量获取事件
- WebSocket连接替代轮询
- 区块数据缓存

#### 步骤20：告警规则引擎
**文件**: `src/services/alertEngine.ts`

功能：
- 自定义告警规则
- 复杂条件组合
- 告警频率控制
- 告警优先级分级

规则示例：
```typescript
const rules = [
  {
    name: '大额转账告警',
    condition: (tx) => parseFloat(tx.value) > 100,
    priority: 'high',
    cooldown: 300  // 5分钟内不重复告警
  },
  {
    name: '可疑交易告警',
    condition: (tx) => isBlacklistedAddress(tx.from),
    priority: 'critical'
  }
];
```

---

## 性能优化建议

### 1. RPC请求优化
- 使用WebSocket替代HTTP轮询
- 实现请求队列和限流
- 多个RPC端点负载均衡

### 2. 内存优化
- 限制交易历史缓存大小
- 使用流式处理大量数据
- 定期清理过期数据

### 3. 错误处理
- 网络断线自动重连
- RPC错误重试机制
- 区块重组处理

---

## 部署方案

### 开发环境
```bash
yarn dev  # 本地开发，自动重启
```

### 生产环境
```bash
# 构建
yarn build

# 使用PM2运行
npm install -g pm2
pm2 start dist/index.js --name crypto-monitor

# 查看日志
pm2 logs crypto-monitor

# 自动重启
pm2 startup
pm2 save
```

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build
CMD ["node", "dist/index.js"]
```

---

## 配置文件示例

### .env.example
```env
# RPC配置
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
RPC_BACKUP_URL=https://eth-mainnet.infura.io/v3/YOUR_PROJECT_ID

# 监控配置
WATCH_ADDRESSES=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
ADDRESS_LABELS=Vitalik

# 过滤配置
MIN_AMOUNT=1.0
FILTER_DIRECTION=all
MONITOR_TOKENS=USDT,USDC,DAI

# 通知配置
NOTIFICATION_TYPE=console,telegram,email

# Telegram配置
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# 邮件配置
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=

# Webhook配置
WEBHOOK_URL=
WEBHOOK_SECRET=

# 数据库配置（可选）
DB_TYPE=sqlite
DB_PATH=./data/transactions.db
```

---

## 测试计划

### 单元测试
- 交易解析功能
- 过滤器逻辑
- 通知服务

### 集成测试
- 端到端监控流程
- 多通知方式协同
- 错误恢复机制

### 压力测试
- 高频交易地址监控
- 多地址并发监控
- 长时间运行稳定性

---

## 学习目标

通过这个项目，你将学习到：

1. **TypeScript实战** - 类型系统、接口设计、泛型
2. **区块链开发** - ethers.js、RPC交互、智能合约调用
3. **异步编程** - Promise、async/await、事件监听
4. **系统设计** - 模块化、服务分层、配置管理
5. **错误处理** - 重试机制、日志记录、异常捕获
6. **性能优化** - 批处理、缓存、并发控制
7. **第三方集成** - Telegram Bot、邮件服务、Webhook

---

## 后续扩展方向

1. **多链支持** - Polygon, BSC, Arbitrum等
2. **DeFi协议监控** - 流动性变化、套利机会
3. **MEV监控** - 抢先交易检测
4. **钱包安全** - 可疑交易告警、黑名单检测
5. **社交功能** - 分享监控配置、社区告警

---

## 当前任务

**下一步：步骤2 - 实现区块链连接服务**

文件：`src/services/blockchain.ts`

预计时间：30分钟

开始？ 🚀
