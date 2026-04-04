# Monorepo 依赖管理规范

## 背景

在 monorepo 中，共享包（如 `@mui-verse/ui`）的依赖分类直接影响消费者的安装体验和运行时行为。错误的分类会导致实例重复、状态不共享、或 bundle 体积膨胀。

## 三类依赖的定位

| 分类 | 安装行为 | 适用场景 |
|------|----------|----------|
| `peerDependencies` | 由消费者提供，不自动安装 | 必须与宿主共享同一实例的库 |
| `dependencies` | 随包一起安装 | 包的内部实现细节，消费者无需感知 |
| `devDependencies` | 仅开发时安装 | 构建、测试、lint 等工具链 |

## 判断规则

### 放 peerDependencies 的：需要共享实例

这类库如果存在多份实例会导致功能异常：

- **React 及其生态**：`react`、`react-dom` — 多实例会导致 hooks 报错
- **框架**：`next` — 路由、构建系统必须全局统一
- **状态管理**：`zustand`、`jotai`、`redux` — 多实例导致 store 隔离，状态无法共享
- **样式引擎**：`@emotion/react`、`@emotion/styled`、`@emotion/cache` — 多实例导致样式注入顺序混乱或 SSR 不一致
- **组件库**：`@mui/material` — 依赖 theme context 单例，必须与消费者共享

**判断标准**：该库是否依赖 React context、全局单例、或模块级共享状态？如果是，放 peerDependencies。

### 放 dependencies 的：内部实现细节

这类库是包的私有实现，多份实例不会造成功能问题：

- **Icon 库**：`lucide-react`、`@heroicons/react` — 纯渲染组件，无共享状态
- **工具函数**：`lodash`、`date-fns`、`clsx` — 无状态的纯函数
- **独立数据处理**：`zod`、`uuid` — 不依赖全局上下文

**判断标准**：该库是否为无状态的纯函数/纯组件？消费者是否无需知道你用了它？如果是，放 dependencies。

### 放 devDependencies 的：仅开发时需要

- 类型定义：`@types/*`
- 构建工具：`typescript`、`tailwindcss`
- 测试/lint：`eslint`、`bun:test`
- peer 的开发副本（见下文）

## peerDependencies 的开发副本

共享包在开发时也需要这些 peer 依赖来做类型检查和本地测试。做法是**同时在 `devDependencies` 中声明**，使用 `catalog:` 统一版本：

```jsonc
// packages/ui/package.json
{
  "peerDependencies": {
    "react": "^19.2.4",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "react": "catalog:",      // 开发时安装，版本由 workspace catalog 统一管理
    "zustand": "catalog:"
  }
}
```

**注意**：不要把 peer 依赖同时放在 `dependencies` 中，否则会安装一份独立副本，与 peerDependencies 的初衷矛盾。

## 快速判断流程

```
新增一个依赖到共享包
    │
    ├─ 仅构建/测试/lint 需要？──Yes──▶ devDependencies
    │
    ├─ 消费者也在用，且必须共享同一实例？
    │   │
    │   ├─ 依赖 React context？──Yes──▶ peerDependencies
    │   ├─ 有全局/模块级状态？──Yes──▶ peerDependencies
    │   └─ theme/styling 引擎？──Yes──▶ peerDependencies
    │
    └─ 包的内部实现，纯函数或纯组件？──Yes──▶ dependencies
```

## 常见依赖分类速查

| 依赖 | 分类 | 原因 |
|------|------|------|
| `react` / `react-dom` | peer | hooks 要求单实例 |
| `next` | peer | 框架全局统一 |
| `@mui/material` | peer | 依赖 ThemeProvider context |
| `@emotion/react` / `styled` / `cache` | peer | 样式引擎单例 |
| `zustand` / `jotai` | peer | store 必须共享 |
| `lucide-react` | dep | 无状态 icon 组件 |
| `clsx` / `date-fns` / `lodash` | dep | 纯函数工具 |
| `zod` | dep | 无状态 schema 验证 |
| `typescript` / `eslint` | dev | 仅开发工具 |
| `@types/*` | dev | 仅类型定义 |
