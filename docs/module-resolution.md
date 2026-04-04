# Monorepo 模块路径解析指南

## 背景

在 monorepo 中，一个包的源文件可能被多种方式引用：包内部自己 import、外部包通过包名 import、或者 bundler（如 Next.js）在构建时 import。不同场景下的解析机制不同，选错路径方式会导致模块找不到。

## 三种路径方式对比

| 方式 | 示例 | 解析依赖 | 包内可用 | 包外可用 |
|------|------|----------|----------|----------|
| 相对路径 | `../hooks/useThemeMode` | 文件系统 | Yes | Yes |
| tsconfig paths | `@/hooks/useThemeMode` | TypeScript + bundler | 取决于 bundler | **No** |
| 自引用（推荐） | `@mui-verse/ui/hooks/useThemeMode` | package.json exports | Yes | Yes |

## 详细说明

### 1. tsconfig `paths`（不推荐跨包使用）

```json
// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- **作用范围**：仅影响 TypeScript 类型检查和 IDE 智能提示
- **运行时**：Node.js/Bun **不读取** tsconfig paths，需要 bundler（如 Next.js/webpack）在构建时做路径转换
- **跨包问题**：当 `packages/synrel` 引用 `packages/ui` 的源文件时，synrel 的 bundler 不会读取 ui 的 tsconfig paths，导致 `@/` 无法解析
- **结论**：仅适用于单包项目（如独立的 Next.js 应用），monorepo 中被外部消费的包不应使用

### 2. 相对路径

```ts
import { useThemeMode } from "../hooks/useThemeMode";
```

- **优点**：在任何场景下都能正确解析，不依赖任何配置
- **缺点**：路径层级深时可读性差（`../../../hooks/useThemeMode`），重构移动文件时需要批量修改

### 3. 自引用（Self-referencing）（推荐）

```ts
// 在 packages/ui 内部，引用自己的 exports
import { useThemeMode } from "@mui-verse/ui/hooks/useThemeMode";
```

前提是 `package.json` 配置了 `exports`：

```json
{
  "name": "@mui-verse/ui",
  "exports": {
    "./hooks/*": "./src/hooks/*.tsx",
    "./components/*": "./src/components/*.tsx",
    "./theme/*": "./src/theme/*.tsx"
  }
}
```

- **原理**：Node.js/Bun 允许包通过自己的包名来 import 自身，解析时走 `package.json` 的 `exports` 字段
- **优点**：
  - 包内外使用完全相同的路径，import 风格统一
  - 不依赖 tsconfig paths 或特定 bundler
  - 重构时路径稳定，不受文件层级变化影响
- **参考**：[Node.js - Self-referencing a package using its name](https://nodejs.org/api/packages.html#self-referencing-a-package-using-its-name)

## 解析流程图

```
import "@mui-verse/ui/hooks/useThemeMode"
        │
        ▼
  Node.js/Bun 模块解析
        │
        ├─ 是否是自身包名？──Yes──▶ 读取自身 package.json exports
        │                                    │
        │                                    ▼
        │                          匹配 "./hooks/*" 规则
        │                                    │
        │                                    ▼
        │                          解析为 ./src/hooks/useThemeMode.tsx
        │
        └─ 是否是外部包？──Yes──▶ 在 node_modules 或 workspace 中查找
                                             │
                                             ▼
                                   读取目标包的 package.json exports
                                             │
                                             ▼
                                   同样匹配 "./hooks/*" 规则
```

## 最佳实践

1. **被外部消费的包**：使用自引用方式，确保包内外路径一致
2. **独立应用（不被其他包引用）**：tsconfig paths 或相对路径都可以
3. **配置 `exports`**：在 `package.json` 中明确声明公开的模块入口，这既是自引用的基础，也是控制包 API 边界的手段
4. **移除无用的 tsconfig paths**：如果已改用自引用，删掉 `paths` 避免混淆
