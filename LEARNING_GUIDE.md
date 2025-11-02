# 加密货币监控项目 - 重敲学习计划

这是一个完整的学习计划，帮助你从零开始重敲整个项目，并在过程中学习 Node.js、TypeScript 和区块链知识。

---

## 项目概览

**目标**：构建一个以太坊交易监控系统，实时监听指定地址的交易活动并发送通知。

**技术栈**：
- Node.js - JavaScript 运行时
- TypeScript - 类型安全的 JavaScript 超集
- ethers.js - 以太坊交互库
- dotenv - 环境变量管理

---

## 阶段1：项目基础架构搭建

### 📋 任务清单

1. ✅ 创建项目目录结构
2. ✅ 初始化 package.json
3. ✅ 配置 TypeScript (tsconfig.json)
4. ✅ 设置 Git 忽略规则 (.gitignore)
5. ✅ 创建环境变量示例 (.env.example)
6. ✅ 实现配置管理模块 (src/config/env.ts)
7. ✅ 定义 TypeScript 类型 (src/types/index.ts)
8. ✅ 实现日志工具 (src/utils/logger.ts)
9. ✅ 实现格式化工具 (src/utils/formatter.ts)
10. ✅ 创建主程序入口 (src/index.ts)

### 📚 Node.js 核心知识点

#### 1. NPM/Yarn 包管理
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",  // 开发模式：自动重启
    "build": "tsc",                                  // 编译 TypeScript
    "start": "node dist/index.js",                   // 运行编译后的代码
    "clean": "rm -rf dist"                           // 清理编译输出
  },
  "dependencies": {      // 运行时依赖
    "dotenv": "^17.2.3",
    "ethers": "^6.15.0"
  },
  "devDependencies": {   // 开发时依赖
    "@types/node": "^24.9.2",
    "nodemon": "^3.1.10",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}
```

**学习要点**：
- `dependencies` vs `devDependencies` 的区别
- `scripts` 脚本的定义和使用
- 版本号语义：`^` 表示兼容版本更新

#### 2. 环境变量管理
```typescript
// 使用 dotenv 加载 .env 文件
import dotenv from 'dotenv';
dotenv.config({ override: true });

// 访问环境变量
const rpcUrl = process.env.RPC_URL;

// 验证必需的环境变量
const required = ['RPC_URL', 'WATCH_ADDRESS'];
const missing = required.filter(key => !process.env[key]);
```

**学习要点**：
- `process.env` 对象用于访问环境变量
- `.env` 文件格式：`KEY=VALUE`
- 环境变量应该保密（不提交到 Git）
- 使用 `.env.example` 作为模板

#### 3. 模块系统
```typescript
// 导出（export）
export function getConfig(): MonitorConfig { }
export class Logger { }
export const logger = new Logger();

// 导入（import）
import { getConfig } from './config/env';
import { logger } from './utils/logger';
```

**学习要点**：
- ES6 模块语法：`import`/`export`
- 相对路径：`./`（当前目录）、`../`（上级目录）
- 命名导出 vs 默认导出

#### 4. 错误处理
```typescript
try {
  // 可能出错的代码
  const config = getConfig();
} catch (error) {
  // 捕获并处理错误
  logger.error('启动失败:', error);
  process.exit(1);  // 退出码 1 表示异常退出
}
```

**学习要点**：
- `try/catch` 块捕获同步错误
- `process.exit(0)` 成功退出，`process.exit(1)` 异常退出

---

### 📚 TypeScript 核心知识点

#### 1. 接口定义
```typescript
// 定义对象的形状
export interface Transaction {
  hash: string;              // 必需属性
  from: string;
  to: string | null;         // 联合类型：字符串或null
  value: string;
  gasPrice: string;
  gasLimit: string;
  blockNumber: number;
  timestamp: number;
}

// 联合类型（字面量类型）
export interface NotificationConfig {
  type: 'console' | 'telegram' | 'email';  // 只能是这三个值之一
  enabled: boolean;
}
```

**学习要点**：
- `interface` 定义对象结构
- 类型注解：`: string`、`: number`
- 联合类型：`string | null`
- 字面量类型：`'console' | 'telegram'`

#### 2. 类（Class）
```typescript
export class Logger {
  private prefix: string;    // 私有属性：只能在类内部访问
  
  constructor(prefix: string = '') {  // 构造函数，可选参数有默认值
    this.prefix = prefix;
  }
  
  info(message: string, ...args: any[]): void {  // void 表示无返回值
    console.log(`${this.getTimestamp()} ${message}`, ...args);
  }
  
  private getTimestamp(): string {  // 私有方法
    return new Date().toISOString();
  }
}
```

**学习要点**：
- 访问修饰符：`private`（私有）、`public`（公开，默认）
- 构造函数：`constructor()`
- 方法定义和返回类型
- 剩余参数：`...args`

#### 3. 函数类型
```typescript
// 函数声明，带类型注解
function validateEnv(): void {  // 无返回值
  // ...
}

// 带返回值的函数
export function getConfig(): MonitorConfig {  // 返回 MonitorConfig 类型
  return {
    rpcUrl: process.env.RPC_URL!,  // ! 表示非空断言
    watchAddresses: [],
    notification: { type: 'console', enabled: true }
  };
}
```

**学习要点**：
- 函数参数类型和返回类型注解
- `void` 表示无返回值
- `!` 非空断言操作符

#### 4. TypeScript 配置 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",           // 编译目标：ES2020
    "module": "commonjs",         // 模块系统：CommonJS
    "outDir": "./dist",           // 输出目录
    "rootDir": "./src",           // 源文件目录
    "strict": true,               // 启用严格模式
    "esModuleInterop": true,      // ES 模块互操作性
    "declaration": true,          // 生成 .d.ts 类型声明文件
    "sourceMap": true             // 生成源码映射（调试用）
  }
}
```

**学习要点**：
- `strict: true` 启用所有严格类型检查
- `outDir` 和 `rootDir` 定义输入输出目录
- `sourceMap` 用于调试 TypeScript 源码

---

## 阶段2：区块链连接服务

### 📋 任务清单

1. ✅ 创建 BlockchainService 类 (src/services/blockchain.ts)
2. ✅ 实现 RPC 连接功能
3. ✅ 实现网络信息获取
4. ✅ 实现区块号查询
5. ✅ 实现新区块监听
6. ✅ 集成到主程序

### 📚 Node.js 核心知识点

#### 1. 异步编程 (async/await)
```typescript
async function connect(): Promise<void> {
  try {
    // await 等待异步操作完成
    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    
    this.isConnected = true;
  } catch (error) {
    logger.error('连接失败:', error);
    throw error;  // 重新抛出错误
  }
}
```

**学习要点**：
- `async` 函数自动返回 Promise
- `await` 等待 Promise 完成
- `try/catch` 捕获异步错误
- `Promise<void>` 表示返回一个 Promise，不返回值

#### 2. 事件驱动编程
```typescript
// 监听事件
this.provider.on('block', (blockNumber: number) => {
  console.log('新区块:', blockNumber);
  callback(blockNumber);  // 调用回调函数
});

// 移除所有监听器
this.provider.removeAllListeners('block');
```

**学习要点**：
- `.on(eventName, callback)` 注册事件监听器
- 回调函数在事件触发时执行
- `.removeAllListeners()` 清理监听器

---

### 📚 区块链核心知识点（重点）

#### 1. 以太坊 RPC 节点
```typescript
// RPC URL 示例
const rpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY';

// 创建 Provider（提供者）
const provider = new ethers.JsonRpcProvider(rpcUrl);
```

**区块链概念**：
- **RPC (Remote Procedure Call)**：远程过程调用，用于与区块链节点通信
- **Provider**：连接到以太坊网络的接口
- **节点**：运行以太坊软件的服务器
- **Alchemy/Infura**：提供免费/付费 RPC 服务的平台

**学习要点**：
- 主网（Mainnet）vs 测试网（Testnet）
- 公共节点 vs 私有节点
- API Key 的作用和保护

#### 2. ethers.js 核心 API
```typescript
// 获取网络信息
const network = await provider.getNetwork();
console.log(network.name);      // 'mainnet'
console.log(network.chainId);   // 1 (主网)

// 获取最新区块号
const blockNumber = await provider.getBlockNumber();
console.log(blockNumber);  // 例如：18500000

// 获取区块详情
const block = await provider.getBlock(blockNumber, true);
// true 表示包含交易详情
```

**学习要点**：
- `getNetwork()` - 获取网络信息（主网/测试网）
- `getBlockNumber()` - 获取最新区块号
- `getBlock()` - 获取区块详细信息
- 所有方法都是异步的，需要 `await`

#### 3. 区块链基础概念
```
区块链结构：
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Block 1 │───▶│ Block 2 │───▶│ Block 3 │
└─────────┘    └─────────┘    └─────────┘
     │              │              │
     ├─ Tx 1        ├─ Tx 3        ├─ Tx 5
     ├─ Tx 2        └─ Tx 4        └─ Tx 6
     └─ ...
```

**核心概念**：
- **区块（Block）**：包含多个交易的数据包
- **区块号（Block Number）**：区块的序号，递增
- **区块时间戳（Timestamp）**：区块创建的时间
- **Chain ID**：区块链网络的唯一标识符
  - 1 = 以太坊主网
  - 5 = Goerli 测试网
  - 11155111 = Sepolia 测试网

#### 4. 实时监听
```typescript
// 监听新区块
provider.on('block', (blockNumber: number) => {
  console.log(`新区块：#${blockNumber}`);
});
```

**学习要点**：
- 以太坊大约每 12 秒产生一个新区块
- 事件监听是异步的，不阻塞程序
- 使用回调函数处理新区块

---

## 阶段3：交易监控功能

### 📋 任务清单

1. ✅ 创建 TransactionMonitor 类 (src/services/monitor.ts)
2. ✅ 实现区块扫描功能
3. ✅ 实现地址过滤逻辑
4. ✅ 实现交易解析
5. ✅ 实现交易方向判断
6. ✅ 集成到主程序

### 📚 Node.js 核心知识点

#### 1. Set 数据结构
```typescript
// 创建 Set 集合（不允许重复）
const watchAddresses = new Set<string>([
  '0xabc...123',
  '0xdef...456'
]);

// 检查元素是否存在（O(1) 时间复杂度）
if (watchAddresses.has('0xabc...123')) {
  console.log('地址在监控列表中');
}

// 添加元素
watchAddresses.add('0xghi...789');
```

**学习要点**：
- `Set` 用于存储唯一值
- `has()` 查找比数组的 `includes()` 更快
- 适合用于地址匹配等场景

#### 2. 数组方法
```typescript
// map：转换数组
const lowerCaseAddresses = addresses.map(addr => addr.toLowerCase());

// filter：过滤数组
const missing = required.filter(key => !process.env[key]);

// for...of：遍历数组
for (const txHash of block.transactions) {
  // 处理每个交易
}
```

**学习要点**：
- `map()` 转换每个元素
- `filter()` 筛选符合条件的元素
- `for...of` 遍历可迭代对象

---

### 📚 TypeScript 核心知识点

#### 1. 可选链操作符
```typescript
// 安全访问可能为 null/undefined 的属性
const to = tx.to?.toLowerCase() || '';

// 等价于
const to = tx.to ? tx.to.toLowerCase() : '';
```

**学习要点**：
- `?.` 可选链：如果左侧为 null/undefined，返回 undefined
- `||` 空值合并：提供默认值

#### 2. 类型守卫
```typescript
// 检查变量是否存在
if (!tx) continue;  // 如果 tx 为 null/undefined，跳过

if (!block.transactions || block.transactions.length === 0) {
  return [];  // 提前返回
}
```

**学习要点**：
- 使用 `if` 语句缩小类型范围
- TypeScript 会自动推断后续代码中的类型

---

### 📚 区块链核心知识点（重点）

#### 1. 以太坊交易结构
```typescript
interface TransactionResponse {
  hash: string;           // 交易哈希（唯一标识）
  from: string;           // 发送方地址
  to: string | null;      // 接收方地址（创建合约时为null）
  value: bigint;          // 转账金额（Wei）
  gasPrice: bigint;       // Gas 价格
  gasLimit: bigint;       // Gas 限制
  blockNumber: number;    // 所在区块号
  nonce: number;          // 交易序号
  data: string;           // 交易数据
}
```

**核心概念**：
- **交易哈希（Tx Hash）**：交易的唯一标识符，66 字符（0x + 64位十六进制）
- **from**：发送方地址（42字符：0x + 40位十六进制）
- **to**：接收方地址（转账）或 null（创建合约）
- **value**：转账金额，以 Wei 为单位
- **Gas**：执行交易的计算费用
  - `gasPrice`：每单位 Gas 的价格
  - `gasLimit`：愿意支付的最大 Gas 数量

#### 2. Wei 和 ETH 单位转换
```typescript
import { ethers } from 'ethers';

// Wei → ETH
const eth = ethers.formatEther('1000000000000000000');  // '1.0'

// ETH → Wei
const wei = ethers.parseEther('1.0');  // 1000000000000000000n

// 单位关系
1 ETH = 1,000,000,000,000,000,000 Wei (10^18)
```

**学习要点**：
- **Wei**：以太坊的最小单位
- **Gwei**：1 Gwei = 10^9 Wei（常用于表示 Gas 价格）
- **ETH**：1 ETH = 10^18 Wei
- 使用 `formatEther()` 和 `parseEther()` 进行转换

#### 3. 以太坊地址
```typescript
// 地址格式
const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

// 地址特征
// - 以 0x 开头
// - 42 个字符（0x + 40 个十六进制字符）
// - 不区分大小写（但有校验和格式）

// 地址比较（需要统一大小写）
const isSame = address1.toLowerCase() === address2.toLowerCase();
```

**学习要点**：
- 地址是以太坊账户的标识符
- 外部账户（EOA）vs 合约账户
- 地址校验和（checksum）用于防止输入错误

#### 4. 扫描区块交易
```typescript
// 获取区块（包含交易）
const block = await provider.getBlock(blockNumber, true);
// true 参数很重要！表示返回完整交易对象

// 遍历交易
for (const txHash of block.transactions) {
  const tx = await provider.getTransaction(txHash as string);
  
  // 过滤相关交易
  if (isRelevant(tx)) {
    processTransaction(tx);
  }
}
```

**学习要点**：
- 每个区块包含多个交易
- 需要逐个获取交易详情
- 根据地址过滤相关交易

---

## 阶段4：通知服务美化

### 📋 任务清单

1. ✅ 设计通知接口 (src/services/notifiers/base.ts)
2. ✅ 创建抽象基类
3. ✅ 实现控制台通知 (src/services/notifiers/console.ts)
4. ✅ 实现美化输出
5. ✅ 实现交易方向识别
6. ✅ 统一导出 (src/services/notifiers/index.ts)
7. ✅ 集成到主程序

### 📚 Node.js 核心知识点

#### 1. ANSI 颜色代码
```typescript
// ANSI 转义码
const red = '\x1b[31m';      // 红色
const green = '\x1b[32m';    // 绿色
const yellow = '\x1b[33m';   // 黄色
const cyan = '\x1b[36m';     // 青色
const reset = '\x1b[0m';     // 重置

// 使用示例
console.log(`${green}成功${reset}`);
console.log(`${red}错误${reset}`);
```

**学习要点**：
- `\x1b[XXm` 是 ANSI 转义码格式
- 用于在终端中显示彩色文本
- `\x1b[0m` 重置所有样式

#### 2. Unicode 字符
```typescript
// 绘制边框
const top = `╔${'═'.repeat(60)}╗`;
const middle = `╠${'═'.repeat(60)}╣`;
const bottom = `╚${'═'.repeat(60)}╝`;
const side = '║';

// 输出
console.log(top);
console.log(`${side}  内容  ${side}`);
console.log(bottom);
```

**学习要点**：
- Unicode 字符可以绘制表格和边框
- `repeat()` 方法重复字符串

#### 3. 字符串填充
```typescript
// 右填充（padEnd）
'Hello'.padEnd(10);      // 'Hello     '
'Hello'.padEnd(10, '.');  // 'Hello.....'

// 左填充（padStart）
'42'.padStart(5, '0');   // '00042'

// 对齐示例
const value = '100.5';
console.log(`金额: ${value.padEnd(10)} ETH`);
```

**学习要点**：
- `padEnd()` 右侧填充，用于左对齐
- `padStart()` 左侧填充，用于右对齐
- 用于创建整齐的表格输出

---

### 📚 TypeScript 核心知识点（重点）

#### 1. 接口设计
```typescript
// 定义接口
export interface INotifier {
  // 方法签名
  notify(tx: Transaction, direction?: 'in' | 'out' | 'self'): Promise<void>;
  sendMessage(message: string): Promise<void>;
}

// 实现接口
export class ConsoleNotifier implements INotifier {
  async notify(tx: Transaction): Promise<void> {
    // 实现方法
  }
  
  async sendMessage(message: string): Promise<void> {
    // 实现方法
  }
}
```

**学习要点**：
- `interface` 定义契约（方法签名）
- `implements` 实现接口
- 实现类必须提供所有接口方法
- 可选参数：`direction?: string`

#### 2. 抽象类
```typescript
// 定义抽象类
export abstract class BaseNotifier implements INotifier {
  protected enabled: boolean;  // protected：子类可访问
  
  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }
  
  // 具体方法（子类可直接使用）
  isEnabled(): boolean {
    return this.enabled;
  }
  
  // 抽象方法（子类必须实现）
  abstract notify(tx: Transaction): Promise<void>;
  abstract sendMessage(message: string): Promise<void>;
}

// 继承抽象类
export class ConsoleNotifier extends BaseNotifier {
  // 必须实现所有抽象方法
  async notify(tx: Transaction): Promise<void> {
    // 具体实现
  }
}
```

**学习要点**：
- `abstract class` 不能直接实例化
- `abstract` 方法只有签名，没有实现
- 子类必须实现所有抽象方法
- `extends` 继承抽象类

#### 3. 访问修饰符
```typescript
class Example {
  public name: string;       // 公开：任何地方可访问（默认）
  private secret: string;    // 私有：只能在类内部访问
  protected config: string;  // 受保护：类和子类可访问
  
  constructor() {
    this.name = 'public';
    this.secret = 'private';
    this.config = 'protected';
  }
  
  private helper() {  // 私有方法
    return this.secret;
  }
}
```

**学习要点**：
- `public`：默认，任何地方可访问
- `private`：只能在类内部访问
- `protected`：类和子类可以访问

#### 4. 联合类型和 switch
```typescript
// 字面量联合类型
type Direction = 'in' | 'out' | 'self';

// switch 语句（类型缩小）
function getIcon(direction: Direction): string {
  switch (direction) {
    case 'in':
      return '📥';
    case 'out':
      return '📤';
    case 'self':
      return '🔄';
  }
}
```

**学习要点**：
- `type` 定义类型别名
- 字面量类型限制可能的值
- `switch` 语句处理所有情况
- TypeScript 会检查是否处理了所有分支

#### 5. 模块导出模式
```typescript
// base.ts
export interface INotifier { }
export abstract class BaseNotifier { }

// console.ts
export class ConsoleNotifier { }

// index.ts（统一导出）
export { INotifier, BaseNotifier } from './base';
export { ConsoleNotifier } from './console';

// 使用时
import { ConsoleNotifier } from './services/notifiers';
```

**学习要点**：
- `export { ... } from` 重新导出
- `index.ts` 作为模块的统一出口
- 简化导入路径

---

### 📚 区块链知识点

#### 交易方向识别
```typescript
function getDirection(tx: Transaction, watchAddress: string) {
  const from = tx.from.toLowerCase();
  const to = tx.to?.toLowerCase() || '';
  const watched = watchAddress.toLowerCase();
  
  if (from === watched && to === watched) {
    return 'self';   // 自己转给自己
  } else if (to === watched) {
    return 'in';     // 接收
  } else {
    return 'out';    // 发送
  }
}
```

**学习要点**：
- **接收（incoming）**：to 地址是监控地址
- **发送（outgoing）**：from 地址是监控地址
- **内部转账（self）**：from 和 to 都是监控地址

---

## 完整开发流程

### 第1天：基础架构（2-3小时）

```bash
# 1. 创建项目目录
mkdir crypto-monitor
cd crypto-monitor

# 2. 初始化项目
yarn init -y

# 3. 安装依赖
yarn add dotenv ethers
yarn add -D typescript ts-node nodemon @types/node

# 4. 创建目录结构
mkdir -p src/{config,services/notifiers,types,utils}

# 5. 创建配置文件
# - tsconfig.json
# - .gitignore
# - .env.example

# 6. 实现基础模块
# - src/types/index.ts
# - src/utils/logger.ts
# - src/utils/formatter.ts
# - src/config/env.ts

# 7. 创建主程序
# - src/index.ts

# 8. 测试运行
yarn dev
```

**检查点**：
- ✅ 能成功加载环境变量
- ✅ 日志输出正常
- ✅ 无 TypeScript 错误

---

### 第2天：区块链连接（2-3小时）

```bash
# 1. 注册 Alchemy 账号
# 访问 https://www.alchemy.com/
# 创建免费 API Key

# 2. 配置 .env 文件
# RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY
# WATCH_ADDRESS=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# 3. 实现区块链服务
# - src/services/blockchain.ts

# 4. 集成到主程序
# - 更新 src/index.ts

# 5. 测试连接
yarn dev
```

**检查点**：
- ✅ 成功连接到以太坊节点
- ✅ 显示网络信息和区块高度
- ✅ 能监听到新区块

---

### 第3天：交易监控（2-3小时）

```bash
# 1. 实现交易监控服务
# - src/services/monitor.ts

# 2. 集成到主程序
# - 更新 src/index.ts

# 3. 测试监控
yarn dev
# 等待新区块，观察是否捕获到相关交易
```

**检查点**：
- ✅ 能扫描区块中的所有交易
- ✅ 能正确过滤目标地址的交易
- ✅ 交易信息格式化正确

---

### 第4天：通知美化（2-3小时）

```bash
# 1. 设计通知接口
# - src/services/notifiers/base.ts

# 2. 实现控制台通知
# - src/services/notifiers/console.ts
# - src/services/notifiers/index.ts

# 3. 集成到主程序
# - 更新 src/index.ts

# 4. 最终测试
yarn dev
```

**检查点**：
- ✅ 交易通知美化显示
- ✅ 正确识别交易方向（接收/发送/内部）
- ✅ 颜色和边框显示正常

---

## 学习资源

### 官方文档

1. **Node.js**
   - 官网：https://nodejs.org/
   - 文档：https://nodejs.org/docs/

2. **TypeScript**
   - 官网：https://www.typescriptlang.org/
   - 手册：https://www.typescriptlang.org/docs/handbook/

3. **ethers.js**
   - 官网：https://ethers.org/
   - 文档：https://docs.ethers.org/v6/

4. **以太坊**
   - 官网：https://ethereum.org/
   - 开发者文档：https://ethereum.org/en/developers/docs/

### 推荐教程

1. **TypeScript 基础**
   - TypeScript 官方教程
   - 《TypeScript Deep Dive》（免费电子书）

2. **异步编程**
   - JavaScript Promise 详解
   - async/await 最佳实践

3. **区块链基础**
   - 以太坊白皮书（中文版）
   - 《精通以太坊》

4. **ethers.js**
   - ethers.js 官方教程
   - 以太坊 DApp 开发入门

---

## 常见问题

### Q1: TypeScript 编译错误怎么办？

**A**: 检查 `tsconfig.json` 配置，确保：
- `strict: true` 启用
- 所有变量都有类型注解
- 使用 `!` 或 `?` 处理可能为 null 的值

### Q2: 无法连接到以太坊节点？

**A**: 
1. 检查 RPC URL 是否正确
2. 确认 API Key 有效
3. 检查网络连接
4. 查看 Alchemy/Infura 控制台的请求限制

### Q3: 监控不到交易？

**A**:
1. 确认地址是否有交易活动
2. 检查地址格式是否正确（大小写）
3. 尝试使用 Vitalik 的地址测试
4. 查看日志输出是否有错误

### Q4: 如何扩展功能？

**A**:
- 添加 Telegram 通知
- 支持多个区块链网络
- 添加交易金额过滤
- 实现历史交易查询
- 添加数据库存储

---

## 项目检查清单

### 代码质量
- [ ] 所有函数都有类型注解
- [ ] 使用 async/await 处理异步操作
- [ ] 正确处理错误（try/catch）
- [ ] 日志输出清晰
- [ ] 代码注释完整

### 功能完整性
- [ ] 环境变量加载正常
- [ ] 区块链连接成功
- [ ] 新区块监听正常
- [ ] 交易过滤准确
- [ ] 通知显示美观

### 最佳实践
- [ ] .env 文件不提交到 Git
- [ ] 使用 .env.example 作为模板
- [ ] 敏感信息（API Key）不暴露
- [ ] 代码结构清晰
- [ ] 模块职责单一

---

## 下一步学习

### 进阶功能

1. **添加更多通知方式**
   - Telegram Bot 通知
   - 邮件通知
   - 桌面通知

2. **支持更多区块链**
   - Polygon（MATIC）
   - Binance Smart Chain（BSC）
   - Arbitrum / Optimism（Layer 2）

3. **数据持久化**
   - 使用 SQLite/PostgreSQL 存储交易
   - 实现历史查询功能

4. **高级过滤**
   - 金额范围过滤
   - Gas 价格监控
   - 智能合约交互识别

5. **Web 界面**
   - 使用 Next.js 构建前端
   - 实时显示交易
   - 图表统计

---

## 总结

通过这个项目，你将学会：

✅ **Node.js 核心技能**
- 包管理（npm/yarn）
- 模块系统
- 异步编程
- 事件驱动

✅ **TypeScript 核心技能**
- 类型系统
- 接口和类
- 泛型
- 模块化

✅ **区块链核心概念**
- 以太坊基础
- RPC 节点
- 区块和交易
- ethers.js 库

✅ **软件工程实践**
- 项目结构设计
- 错误处理
- 日志管理
- 配置管理

---

**祝你学习愉快！如有问题，随时查阅本文档。** 🚀

