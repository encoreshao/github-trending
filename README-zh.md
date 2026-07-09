# GitHub 趋势

> 发现和分析热门 GitHub 仓库，拥有美观现代的界面。

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)

**[在线演示](https://github.ranbot.online)** · **[报告问题](https://github.com/encoreshao/github-trending/issues)** · **[功能建议](https://github.com/encoreshao/github-trending/issues)**

[English](README.md) | [中文](README-zh.md)

---

## 概述

一个现代化的 Web 应用程序，用于发现 GitHub 热门仓库。支持实时数据获取、多视图模式、导出功能，以及精美的深色主题界面。

### 核心功能

| 功能 | 描述 |
|------|------|
| **实时数据** | 通过 GitHub API 实时获取热门仓库 |
| **双视图模式** | 表格视图用于数据分析，卡片视图用于可视化浏览 |
| **智能筛选** | 按分类、关键词和 20+ 属性进行筛选 |
| **周报 & 月报** | 按滚动周期刷新的精选 Top 20 页面，并展示周/月环比变化 |
| **个性化订阅** | 选择感兴趣的主题，直接提交到 Google 表格 |
| **导出选项** | 下载为 CSV、JSON 或复制到剪贴板 |
| **深色主题** | 现代毛玻璃设计，流畅动画效果 |
| **双语支持** | 完整的英文和中文语言支持 |

---

## 快速开始

### 环境要求

- Node.js 16+
- GitHub 个人访问令牌（[点击获取](https://github.com/settings/tokens)）

### 安装

```bash
# 克隆仓库
git clone https://github.com/encoreshao/github-trending.git
cd github-trending

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:5173](http://localhost:5173)。

### 使用方法

1. 导航到 **实时演示**（`/demo`）
2. 在设置面板中输入您的 GitHub 令牌
3. 选择要显示的字段
4. 点击 **获取数据** 加载热门仓库
5. 在表格和卡片视图之间切换
6. 根据需要导出数据

---

## 页面

| 路由 | 描述 |
|------|------|
| `/` | 主页，展示功能亮点 |
| `/demo` | 交互式仓库分析工具 |
| `/weekly` | 最近 30 天内创建的 Top 20 仓库，每周一刷新 |
| `/monthly` | 最近 90 天内创建的 Top 20 仓库，每月 1 日刷新 |
| `/subscribe` | 基于分类的订阅设置，提交至 Google 表格 |
| `*` | 未匹配或被显式屏蔽的路由的自定义 404 页面（见 `src/blockedRoutes.js`） |

---

## 技术栈

- **前端：** React 18、Vite、Ant Design 5
- **样式：** CSS3 毛玻璃效果
- **接口：** GitHub REST API
- **数据：** axios、papaparse、file-saver

---

## 项目结构

```
src/
├── api/                 # GitHub API + Google 表格集成
├── components/          # 可复用 UI 组件
│   ├── Header           # 导航栏
│   ├── Footer           # 页脚
│   ├── RepoTable        # 表格视图组件
│   ├── RepoCard         # 卡片视图组件
│   ├── TrendingPeriodPage # 周报/月报页面共用外壳
│   └── Settings         # 配置面板
├── pages/               # 路由页面
│   ├── HomePage
│   ├── DemoPage
│   ├── WeeklyPage
│   ├── MonthlyPage
│   ├── SubscriptionPage
│   └── NotFoundPage
├── blockedRoutes.js     # 需强制走 404 页面的路径
├── locales/             # 国际化翻译
└── utils/               # 工具函数
```

---

## CLI 脚本（可选）

用于自动化数据收集：

```bash
# 设置环境变量
echo "GITHUB_TOKEN=your_token" > .env

# 按周期运行脚本（默认 daily）
node index.js --period=daily
node index.js --period=weekly
node index.js --period=monthly

# 或使用 npm
npm run trending:daily
npm run trending:weekly
npm run trending:monthly
```

每个周期都会以该周期起始日期命名，保存一份 JSON + CSV 快照：

| 周期 | 输出路径 | 文件名 |
|------|----------|--------|
| `daily` | `docs/YYYY/MM/` | `YYYY-MM-DD`（今天） |
| `weekly` | `docs/weekly/YYYY/MM/` | `YYYY-MM-DD`（当前 ISO 周的周一） |
| `monthly` | `docs/monthly/YYYY/` | `YYYY-MM`（当前月） |

### 使用 Cron 自动化

```bash
# 每天上午 9 点执行
0 9 * * * cd /path/to/github-trending && npm run trending:daily

# 每周一上午 9 点执行
0 9 * * 1 cd /path/to/github-trending && npm run trending:weekly

# 每月 1 日上午 9 点执行
0 9 1 * * cd /path/to/github-trending && npm run trending:monthly
```

`scripts/` 目录下也提供了对应周期的现成脚本（`run.sh`、`run-weekly.sh`、`run-monthly.sh`）。

---

## 配置

### Web 应用设置

设置自动保存在 localStorage 中：

- **GitHub 令牌** - 您的个人访问令牌（本地存储）
- **显示字段** - 从 20+ 个仓库属性中选择
- **每页数量** - 每页仓库数（1-100）
- **语言** - 英文或中文

### 订阅 → Google 表格

`/subscribe` 表单会将提交内容 POST 到 Google Apps Script Web App，并追加写入 Google 表格。请在 `.env` 中设置该 Webhook 地址：

```bash
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

Apps Script 的部署步骤见 `docs/subscribe-google-sheets-setup.md`（仅本地保留，未纳入 git 版本控制）。未设置该变量时，提交会明确报错，而不是静默失败。

### 可用字段

| 基本信息 | URL | 日期 | 统计 |
|----------|-----|------|------|
| 名称 | HTML URL | 创建时间 | 星标 |
| 所有者 | Git URL | 更新时间 | 分支 |
| 头像 | SSH URL | 推送时间 | 问题 |
| 描述 | Clone URL | | 大小 |
| 主题 | SVN URL | | 语言 |
| 许可证 | 主页 | | |

---

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| **超出速率限制** | 确保 GitHub 令牌有效且具有 `public_repo` 权限 |
| **没有返回数据** | 验证令牌和网络连接 |
| **构建错误** | 运行 `rm -rf node_modules && npm install` |

---

## 贡献

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

---

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)。

---

<p align="center">
  由 <a href="https://github.com/encoreshao">RanBOT Labs</a> 用 ❤️ 制作
</p>
