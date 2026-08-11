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

## 打包

### standalone

- next.config.ts 中 `output` 配置为 `standalone`.

- 参考 [Taskfile.yml](./Taskfile.yml) 中的 `package-example`.
  - 与单模块的打包不同, 执行 `next build` 后，输出目录 `.next/standalone` 下会包含子目录, 如 `examples`。 该目录是与业务工程在 monorepo 中的目录结构保持一致; 比如, 如果业务工程目录是在 `apps/business`, 那打包后目录 `.next/standalone/apps/business` 才是目标输出目录。

  - 但是，我们打包发布包时，需要以 `.next/standalone` 为基准目录，因为 工程目录 下的依赖会从 `.next/standalone` 下软链过来。

  - 业务工程下的静态文件，如 `public` 和 `.next/static` 还是拷贝到业务的输出目录，如 `.next/standalone/examples`。

- 启动时，工作目录是基准目录或者业务工程的输出目录均可。以基准目录为工作目录，启动即为 `node examples/server.js`。

### export

- next.config.ts 中 `output` 配置为 `export`.

  > 此时, 工程中无法使用 server 组件.

- 在业务工程目录下执行 `next build` 后，输出目录为 `out`.

默认情况下，子目录下的组件编译输出目录也是 `out` 目录，比如 `examples/src/app/login` 编译输出是 `out/login.html`，而不是 `out/login/index.html`。 如果这时使用静态服务器部署，会出现 404 的错误。

需要在 `next.config.ts` 中增加 `trailingSlash: true` 配置。

## bun monorepo

- `--filter` 和 `--cwd`

  通过 `--filter` 执行时，会导致有一些日志被折叠，无法输出。比如 `bun run --filter examples build`, 如果 `examples` 有构建失败，难以看到详细的错误; 需要使用 `bun run --cwd examples build`, 跟在 examples 目录下执行 `bun run build` 一样。
