# mui-verse

## 开发

### prettier

- 安装 `prettier` 和 `prettier-plugin-tailwindcss` 依赖，用于自动化排序 tailwindcss 类名。

  ```bash
  bun install -D prettier prettier-plugin-tailwindcss
  ```

- 配置参考 [prettier.config.ts](./prettier.config.ts).

## 使用

参考 [examples](./examples).

- 引用 `verse.css` 文件。在工程的 `globals.css` 文件中引入 `verse.css` 文件。如下:

  ```css
  @import "@mui-verse/ui/verse.css";
  @source "../../node_modules/@mui-verse/ui/src";
  ```

  > 注意: 由于直接是源码的方式引入，所以需要在 `globals.css` 文件中通过 `@source` 指定 `@mui-verse/ui` 的 `src` 目录，这样，tailwind css 在编译时才能解析到 `@mui-verse/ui` 下的 classname。 否则，可能会出现样式未生效的情况。
