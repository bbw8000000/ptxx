# 添加在线工具

这个项目的工具页面都放在 `src/pages/tools/`，首页工具卡片和工作流入口在 `src/pages/tools/index.astro` 里维护。

## 新增一个工具页面

1. 在 `src/pages/tools/` 下新建页面，例如：

```text
src/pages/tools/my-tool.astro
```

2. 页面使用 `BaseLayout`，标题写清楚工具用途。

3. 工具逻辑尽量放在当前页面内，优先保证：

- 浏览器本地运行
- 不上传用户输入
- 移动端可用
- 空输入、错误输入有清楚提示

## 加到工具首页

在 `src/pages/tools/index.astro` 里找到工具分类数据，把新工具加入对应分类：

```ts
{
  title: '工具名称',
  description: '一句话说明这个工具能做什么。',
  href: `${import.meta.env.BASE_URL}tools/my-tool/`,
}
```

如果它适合某个常用流程，也可以加入 workflow 的工具链路。

## 命名建议

- URL 使用英文小写和连字符，例如 `image-compress`
- 页面标题用中文，例如 `图片压缩`
- 说明文案尽量面向普通用户，不要堆技术词

## 提交前检查

```sh
npm run build
```

至少手动确认：

- 工具首页能看到入口
- 工具页面能打开
- 输入、清空、复制等核心操作能用
- 手机宽度下不横向溢出
