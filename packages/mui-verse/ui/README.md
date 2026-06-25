# @mui-verse/ui

基于 Material UI + Tailwind CSS v4 的组件与主题层，以 **源码包**（非预编译产物）的形式发布到业务工程，配合 Next.js 使用。

---

## 接入步骤

### 1. 创建 bun monorepo

在你的业务仓库根目录初始化一个 bun workspace。`package.json` 至少包含：

```jsonc
{
  "name": "your-app",
  "private": true,
  "workspaces": [
    "packages/mui-verse/ui",
    "packages/app"
  ],
  "catalog": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/material": "^7.3.9",
    "@emotion/cache": "^11.14.0",
    "@mui/material-nextjs": "^7.3.9",
    "zustand": "^5.0.12",
    "next-intl": "^4.9.0"
  },
  "scripts": {
    "dev": "bun run --cwd packages/app dev",
    "build": "bun run --cwd packages/app build"
  }
}
```

要点：

- `workspaces` 必须包含 `packages/mui-verse/ui`（submodule 挂上后会出现的真实路径）以及你自己的应用包。
- `catalog` 字段统一锁定 React / Next / MUI 等共享依赖版本；业务包和 `mui-verse/ui` 内部都通过 `"next": "catalog:"` 这种写法引用，避免重复版本带来的 React 双实例问题。
- 业务包通过 `"@mui-verse/ui": "workspace:*"` 引用 mui-verse。

### 2. 通过 git submodule 挂载 mui-verse

在仓库根目录执行：

```bash
git submodule add -b dev/0.1 git@github.com:taichu-lang/mui-verse.git packages/mui-verse
git submodule update --init --recursive
```

此时目录结构如下：

```
your-repo/
├─ package.json              # bun workspace 根
├─ .gitmodules
├─ packages/
│  ├─ app/                   # 业务 Next.js 应用
│  └─ mui-verse/             # 作为 submodule 挂载
│     ├─ ui/                 # @mui-verse/ui 包（workspace 成员）
│     ├─ payment/
│     └─ examples/
└─ ...
```

克隆已有仓库时需要带上 submodule：

```bash
git clone --recurse-submodules git@github.com:your-org/your-repo.git
# 或克隆后补拉
git submodule update --init --recursive
```

升级到 mui-verse 上游最新提交：

```bash
git submodule update --remote packages/mui-verse
git add packages/mui-verse && git commit -m "chore: bump mui-verse"
```

### 3. 安装依赖

```bash
bun install
```

bun 会读取 workspaces 字段并把 `@mui-verse/ui` 软链到 `node_modules/@mui-verse/ui`，业务包就能以普通包的方式 `import`。

### 4. 在业务包中引入 verse.css

`packages/app/src/app/globals.css`：

```css
@import "@mui-verse/ui/verse.css";
@source "../../node_modules/@mui-verse/ui/src";
```

注意：因为是源码引入，Tailwind v4 编译时需要扫描 `@mui-verse/ui` 的源代码才能收集到组件里用到的 className。`@source` 这一行**不能省**，否则会出现样式部分缺失。

`packages/app/postcss.config.mjs`：

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

在 `app/layout.tsx` 顶部 `import "./globals.css"` 即可。

---

## VSCode 配置

mui-verse 使用 Tailwind v4 的 CSS-first 配置，所有设计 token（`@theme`、`@theme inline`）、自定义工具类（`@utility typography-*` 等）都写在 `verse.css` 里，没有 `tailwind.config.js`。

VSCode 的 Tailwind IntelliSense 在 monorepo 子包里**不会自动发现这个入口**，需要在工作区根目录手工指定：

`.vscode/settings.json`：

```json
{
  "tailwindCSS.experimental.configFile": "packages/mui-verse/ui/src/verse.css",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

要点说明：

- **必须指向 `verse.css`**，不要指向业务工程的 `globals.css`。因为 `globals.css` 用的是 `@import "@mui-verse/ui/verse.css"` 这种包名导入，IntelliSense 插件不会跑 Node 模块解析，会判定为"不是有效的 v4 入口"而失效。
- **不要写 `tailwind.config.js`**。一旦写了 v3 风格的 config，插件会切到 v3 模式，`verse.css` 里 `@theme inline` 定义的 MUI 调色板（`primary-500`、`gray-50`、`shadow-surface-md`、`typography-h1` 等）将得不到补全和颜色预览——编辑器看到的世界和运行时编译的世界会出现漂移。
- `files.associations` 将 `.css` 关联为 `tailwindcss` 语言，避免 `@theme` / `@utility` / `@source` / `@layer` 等 v4 指令被原生 CSS 解析器标红。
- 扩展版本要求：`bradlc.vscode-tailwindcss` ≥ 0.14（更早的版本对 v4 支持不稳）。

配置完成后 reload window，打开 `Cmd/Ctrl+Shift+P` → "Tailwind CSS: Show Output" 确认日志识别为 v4。在任意组件文件输入 `bg-secondary-` 应能补全到 `secondary-500`、`secondary-contrast` 等 MUI token——能补全才说明入口被正确读取。

---

## 常见问题

**Q: `bun install` 后 `node_modules/@mui-verse/ui` 是空目录。**
确认根 `package.json` 的 `workspaces` 字段里包含 `packages/mui-verse/ui`（而不是只写 `packages/mui-verse`，因为 `mui-verse` 本身不是包，`ui`/`payment` 才是）。

**Q: 页面起来了但部分 mui-verse 组件的样式没生效。**
检查 `globals.css` 里是否有 `@source "../../node_modules/@mui-verse/ui/src";` 这一行。

**Q: 切换 mui-verse 分支后业务工程报类型/导出错误。**
submodule 切换后要在 monorepo 根重新跑 `bun install`，刷新 `@mui-verse/ui` 的 `exports` 映射。
