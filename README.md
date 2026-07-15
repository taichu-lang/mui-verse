# Anna Web

## 流式消息

- Streamdown 支持流式消息的渲染，也就是 markdown 在返回不完整的情况下也不会报错.

- 如果是开启 `web_search`，展示搜索来源时，因为不能直接将 `annotation` 的内容在后端保存到 message 表中，否则会影响用户检索消息历史的准确性. 所以，就需要按照一个特色的 html tag 来渲染. 后端会将搜索来源组装成 `<annotation>` 标签.

- 但这里有个问题需要注意: 在流式输出中，`annotation` 返回的时机是穿插在模型的回复中的，也就可能是 `delta 1`, `delta 2`, `annotation 1`, `delta 3` 的顺序. 这样很有可能在一个完整的 markdown tag 返回前，中间穿插一个 `annotation`. 比如 `<p>今天的天气是晴天`, `annotation`, `[xx](yy)</p>`. 这样就可能会导致 annotation 被渲染在不合适的地方. 所以，应该是在整个流式渲染的过程中，不推送 annotation 到前端，等流式输出结束，Streamdown 得到完整的 markdown 内容后，再推送 annotation 的列表，更新整个会话.

## issues

- 打开 web_search 时, 搜索来源目前是根据大模型返回的 `annotation` 来确定的. 在一轮对话中，不同的回复可能会引用了相同的来源，也就是会有两个 `annotation` 的 `title` 和 `url` 都是一样的. 也可能 `url` 中只是带了无关的 search parameter. 这样在展示来源时, 用户看到的可能是重复的内容.

  - 千问是在 AI 回复中按照引用列表标号的方式来展示的，比较符合用户的直觉.
  - chatgpt 是存在重复的.
