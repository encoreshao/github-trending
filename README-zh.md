# GitHub 趋势工具包 - 每周热门仓库 (2025 活跃版)

一个全面的工具包，用于获取和显示 GitHub 每周热门仓库，包含 Node.js CLI 脚本和现代化的 React Web 应用程序，支持双语。

**Languages / 语言**: [English](README.md) | [中文](README-zh.md)

---

## ✨ 功能特性

### 🌐 Web 应用程序 (React + Ant Design)
- **交互式界面**: 现代化、响应式 Web 界面，支持双语 (English/中文)
- **双视图模式**: 表格视图显示详细数据，卡片视图用于可视化浏览
- **可定制字段**: 从 20+ 个仓库属性中选择显示内容
- **高级筛选**: 按分类/关键词筛选仓库
- **导出选项**: 导出为 CSV、JSON 或复制到剪贴板
- **实时数据**: 获取上周创建的 trending 仓库
- **持久化设置**: 设置保存在浏览器 localStorage 中
- **响应式设计**: 支持桌面和移动设备

### 📊 Node.js CLI 脚本
- **自动获取**: 获取上周创建的 GitHub 前 20 个热门仓库
- **多格式输出**: 保存为 Markdown、JSON 和 CSV 文件
- **Cron 自动化**: 可通过 cron 实现每日数据收集自动化
- **全面数据**: 包含所有仓库元数据（星标、分支、问题等）

---

## 🚀 快速开始

### Web 应用程序

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **打开浏览器**
   访问 [http://localhost:5173](http://localhost:5173)

4. **获取 GitHub Token**
   - 前往 [GitHub 设置 > 开发者设置 > 个人访问令牌](https://github.com/settings/tokens)
   - 生成一个具有 `public_repo` 权限的新令牌
   - 在 Web 应用程序中输入令牌

### 生产环境构建
```bash
npm run build
```

### Node.js CLI 脚本

1. **设置环境**
   - 在项目根目录创建 `.env` 文件：
     ```env
     GITHUB_TOKEN=your_github_token
     ```

2. **运行脚本**
   ```bash
   node index.js
   ```
   - 热门数据将保存在 `docs/` 目录中，格式为 Markdown、JSON 和 CSV 文件

3. **使用 cron 自动化**（可选）
   ```bash
   # 添加到 crontab 中，每天上午 9 点执行
   0 9 * * * cd /path/to/github-trending && node index.js
   ```

---

## 🛠 技术栈

### Web 应用程序
- **前端**: React 18, Ant Design 5, Vite
- **样式**: CSS3 现代化网格布局和响应式设计
- **数据处理**: axios, file-saver, papaparse, react-copy-to-clipboard
- **构建工具**: Vite 用于快速开发和优化的生产构建

### Node.js 脚本
- **运行时**: Node.js
- **HTTP 客户端**: axios
- **文件系统**: fs-extra
- **数据处理**: json2csv
- **环境**: dotenv

---

## 📁 项目结构

```
github-trending/
├── src/
│   ├── components/
│   │   ├── AttributeSelector.jsx    # 字段选择组件
│   │   ├── RepoCardView.jsx         # 卡片视图组件
│   │   ├── RepoTable.jsx            # 表格视图组件
│   │   ├── SettingsPanel.jsx       # 设置面板
│   │   └── TokenInput.jsx           # 令牌输入组件
│   ├── api/
│   │   └── github.js               # GitHub API 集成
│   ├── App.jsx                     # 主应用程序组件
│   ├── App.css                     # 应用程序样式
│   └── main.jsx                    # 应用程序入口点
├── docs/                           # CLI 脚本输出目录
├── index.js                        # Node.js CLI 脚本
├── package.json                    # 依赖和脚本
└── README.md                       # 此文件
```

---

## 🎯 使用指南

### Web 应用程序功能

1. **设置面板**（左侧边栏）
   - **GitHub 令牌**: 输入您的个人访问令牌
   - **字段选择**: 选择要显示的仓库属性
   - **页面大小**: 设置每页仓库数量（1-100）
   - **分类筛选**: 按特定关键词或分类筛选
   - **语言**: 在英文和中文之间切换

2. **数据显示**（主区域）
   - **视图模式**: 在表格和卡片视图之间切换
   - **表格视图**: 详细的表格数据，支持可排序列
   - **卡片视图**: 带有仓库信息的可视化卡片
   - **导出选项**: CSV、JSON 或复制到剪贴板

3. **可用字段**
   - 仓库名称、星标、所有者、头像
   - 描述、主题、URL（HTML、Git、SSH、Clone、SVN）
   - 创建/更新/推送日期
   - 大小、语言、分支、问题、许可证
   - 默认分支和主页

### Node.js 脚本输出

CLI 脚本在 `docs/` 目录中生成三种类型的文件：

1. **Markdown 文件**（`YYYY-MM-DD.md` 和 `YYYY-MM-DD-table.md`）
   - 详细的仓库信息
   - 表格格式，便于阅读
   - 包含所有元数据

2. **JSON 文件**（`YYYY-MM-DD.json`）
   - 结构化数据，用于程序化使用
   - 仅包含选定字段，提高效率

3. **CSV 文件**（`YYYY-MM-DD.csv`）
   - 电子表格兼容格式
   - 包含所有仓库字段

---

## ⚙️ 配置

### Web 应用程序
- 设置自动保存在浏览器 localStorage 中
- 令牌安全存储（不传输到外部服务器）
- 字段选择在会话间保持

### Node.js 脚本
- 通过 `.env` 文件配置
- 修改 `index.js` 以更改输出格式或字段
- 通过修改 `getLastWeekDate()` 函数调整日期范围

---

## 🔧 自定义

### 添加新字段
1. **Web 应用程序**: 编辑 `src/components/AttributeSelector.jsx`
2. **Node.js 脚本**: 修改 `saveReposToCsv()` 中的 `fields` 数组

### 样式更改
- **Web 应用程序**: 修改 `src/App.css` 进行自定义样式
- **卡片布局**: 调整 `.grid` 类中的网格设置
- **颜色**: 更新 CSS 自定义属性

### API 修改
- **Web 应用程序**: 扩展 `src/api/github.js` 以添加更多 GitHub API 端点
- **Node.js 脚本**: 修改 `fetchTrendingRepos()` 中的搜索查询

---

## 📋 要求

- **Node.js**: 版本 16 或更高
- **GitHub 令牌**: 具有 `public_repo` 权限的个人访问令牌
- **浏览器**: 支持 ES6+ 的现代浏览器

---

## 🐛 故障排除

### 常见问题

1. **超出速率限制**
   - 确保您有有效的 GitHub 令牌
   - 检查令牌权限是否包含 `public_repo` 范围

2. **没有返回数据**
   - 验证您的令牌是否正确
   - 检查网络连接
   - 确保指定日期范围内存在仓库

3. **构建错误**
   - 清除 node_modules 并重新安装：`rm -rf node_modules && npm install`
   - 检查 Node.js 版本兼容性

---

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature-name`
3. 进行更改
4. 提交更改：`git commit -m 'Add feature'`
5. 推送到分支：`git push origin feature-name`
6. 提交拉取请求

---

## 📄 许可证

本项目在 [MIT 许可证](https://opensource.org/licenses/MIT) 条款下作为开源软件提供。

---

## 🔗 链接

- **GitHub 仓库**: [https://github.com/encoreshao/github-trending](https://github.com/encoreshao/github-trending)
- **在线演示**: [https://github.ranbot.online](https://github.ranbot.online)
- **问题反馈**: [报告错误或请求功能](https://github.com/encoreshao/github-trending/issues)
