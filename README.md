# 🔍 Crypto Monitor

一个基于 Node.js + TypeScript 的实时以太坊交易监控系统，用于监控特定地址的交易活动并发送通知。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## ✨ 特性

- 🔗 **实时监控** - 监听以太坊区块链上的新区块和交易
- 🎯 **地址过滤** - 支持监控指定地址的交易活动
- 💰 **交易解析** - 自动解析交易详情（发送方、接收方、金额、Gas 等）
- 🎨 **美化输出** - 彩色终端输出，清晰展示交易信息
- 📊 **方向识别** - 自动识别交易方向（接收/发送/内部转账）
- 🔧 **类型安全** - 使用 TypeScript 提供完整的类型检查
- ⚙️ **配置灵活** - 通过环境变量轻松配置

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- Yarn 或 npm
- Alchemy API Key（免费注册：[https://www.alchemy.com/](https://www.alchemy.com/)）

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/crypto-monitor.git
cd crypto-monitor

# 安装依赖
yarn install
# 或
npm install
```

### 配置

1. 复制环境变量示例文件：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的配置：

```env
# Alchemy RPC URL (去 https://www.alchemy.com/ 注册免费 API Key)
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY

# 要监控的地址（可以填多个，用逗号分隔）
WATCH_ADDRESS=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# 通知方式（目前支持 console）
NOTIFICATION_TYPE=console
```

### 运行

```bash
# 开发模式（支持热重载）
yarn dev

# 编译 TypeScript
yarn build

# 运行编译后的代码
yarn start
```

## 📖 使用示例

启动后，系统会实时监控指定地址的交易活动：

```
2025-11-02T10:30:45.123Z [CryptoMonitor] ℹ️  🚀 启动加密货币监控系统...
2025-11-02T10:30:45.456Z [CryptoMonitor] ✅ ✓ 配置加载成功
2025-11-02T10:30:45.457Z [CryptoMonitor] ℹ️  监控地址: 0xd8dA...6045
2025-11-02T10:30:45.789Z [CryptoMonitor] ℹ️  正在连接到以太坊节点...
2025-11-02T10:30:46.123Z [CryptoMonitor] ✅ ✓ 已连接到网络: mainnet (Chain ID: 1)
2025-11-02T10:30:46.456Z [CryptoMonitor] ℹ️  当前区块高度: 18,234,567
2025-11-02T10:30:46.789Z [CryptoMonitor] ✅ ✓ 系统初始化完成！
2025-11-02T10:30:46.790Z [CryptoMonitor] ℹ️  🔍 监控系统运行中... (按 Ctrl+C 退出)
```

当检测到相关交易时，会显示美化的通知：

```
✓ 区块 #18234568 - 发现 1 笔相关交易

╔════════════════════════════════════════════════════════════╗
║  📥  接收交易                                                ║
╠════════════════════════════════════════════════════════════╣
║  📝 交易哈希: 0x1234abcd...5678ef90                         ║
║  💰 金额: 1.5                                       ETH    ║
║  📤 发送方: 0xabcd...ef01                                   ║
║  📥 接收方: 0xd8dA...6045                                   ║
║  ⛽ Gas价格: 0.000000025                              ETH    ║
║  🔗 区块: 18,234,568                                        ║
║  🕐 时间: 2025/11/2 18:30:47                                ║
╚════════════════════════════════════════════════════════════╝
```

## 🏗️ 项目结构

```
crypto-monitor/
├── src/
│   ├── config/
│   │   └── env.ts              # 环境变量配置
│   ├── services/
│   │   ├── blockchain.ts       # 区块链连接服务
│   │   ├── monitor.ts          # 交易监控服务
│   │   └── notifiers/          # 通知服务
│   │       ├── base.ts         # 通知接口和基类
│   │       ├── console.ts      # 控制台通知实现
│   │       └── index.ts        # 统一导出
│   ├── types/
│   │   └── index.ts            # TypeScript 类型定义
│   ├── utils/
│   │   ├── logger.ts           # 日志工具
│   │   └── formatter.ts        # 数据格式化工具
│   └── index.ts                # 程序入口
├── .env.example                # 环境变量示例
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── LICENSE                     # MIT 许可证
├── LEARNING_GUIDE.md           # 学习指南
└── README.md                   # 项目说明
```

## 🎓 学习资源

本项目适合学习 Node.js、TypeScript 和区块链开发。详细的学习指南请查看：

📚 [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) - 包含完整的4个阶段学习计划，每个阶段都有详细的知识点讲解和代码示例。

### 学习内容

- ✅ Node.js 核心概念（模块系统、异步编程、事件驱动）
- ✅ TypeScript 类型系统（接口、类、泛型、抽象类）
- ✅ 区块链基础（以太坊、区块、交易、地址）
- ✅ ethers.js 使用（Provider、区块监听、交易查询）
- ✅ 项目架构设计（模块化、服务分层、配置管理）

## 🛠️ 技术栈

- **运行时**: [Node.js](https://nodejs.org/) - JavaScript 运行环境
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **区块链库**: [ethers.js v6](https://docs.ethers.org/) - 以太坊交互库
- **环境变量**: [dotenv](https://github.com/motdotla/dotenv) - 环境变量管理
- **开发工具**: 
  - [ts-node](https://typestrong.org/ts-node/) - 直接运行 TypeScript
  - [nodemon](https://nodemon.io/) - 自动重启开发服务器

## 📝 脚本命令

```bash
# 开发模式（支持热重载）
yarn dev

# 编译 TypeScript 到 JavaScript
yarn build

# 运行编译后的代码
yarn start

# 清理编译输出
yarn clean
```

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 必填 | 示例 |
|--------|------|------|------|
| `RPC_URL` | 以太坊 RPC 节点地址 | ✅ | `https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY` |
| `WATCH_ADDRESS` | 要监控的地址（多个用逗号分隔） | ✅ | `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` |
| `NOTIFICATION_TYPE` | 通知方式 | ❌ | `console`（默认） |

## 🚧 路线图

- [x] 基础监控功能
- [x] 控制台美化输出
- [x] 交易方向识别
- [ ] ERC-20 代币支持
- [ ] Telegram Bot 通知
- [ ] 邮件通知
- [ ] Webhook 通知
- [ ] 历史交易查询
- [ ] Web 界面
- [ ] 数据库持久化
- [ ] 多链支持（Polygon、BSC 等）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👤 作者

**Konnor-Jade**

## 🙏 致谢

- [ethers.js](https://docs.ethers.org/) - 强大的以太坊库
- [Alchemy](https://www.alchemy.com/) - 提供稳定的 RPC 服务
- [TypeScript](https://www.typescriptlang.org/) - 让 JavaScript 更安全

## ⚠️ 免责声明

本项目仅供学习和研究使用。使用本项目进行交易监控时，请遵守相关法律法规。作者不对使用本项目造成的任何损失负责。

---

如果这个项目对你有帮助，请给一个 ⭐️ Star！

