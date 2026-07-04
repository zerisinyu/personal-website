# 内容更新指南

日常更新只涉及两件事：**项目**（`src/content/projects/`）和**博客**（`src/content/blog/`）。
两条路径任选：浏览器里用 CMS（推荐，无需碰代码），或本地放 markdown 文件。
无论哪种方式，内容一旦推到 `main` 分支，站点会自动重新构建，**1–2 分钟后上线**。

---

## 方式一：浏览器 CMS（日常推荐）

入口：**https://zerisinyu.github.io/personal-website/admin/**

首次使用点 "Sign in with GitHub"，授权后进入编辑界面。左侧有两个栏目：Blog 和 Projects。

### 写一篇博客

1. 左侧选 **Blog** → 点 **Create new entry**。
2. 填 Title、Date（必填），Summary 一句话（会显示在列表页和 RSS 里，建议填）。
3. 正文在 Body 里写，编辑器支持 markdown 快捷键；图片直接拖进正文，会自动存到文章旁边。
4. 想先存草稿：把 **Draft** 开关打开——草稿不会出现在线上。
5. 点右上角 **Save** 即发布（本质是一次 git 提交），等一两分钟刷新博客页即可看到。

### 上传一个项目

1. 左侧选 **Projects** → **Create new entry**。
2. 必填三样：**Title**、**Summary**（卡片上那句话）、**Year**。
3. **Cover image** 传一张缩略图（首页和 /work 网格用，比例接近 4:3 最好看）。
4. **Type** 选项：
   - `case-study`（默认）：正文写在 Body 里，站点自动生成项目详情页。日常图文项目都用这个。
   - `external`：项目在别的平台，把完整网址填进 **Link**，卡片点击直接跳外站。
   - `custom`：自建交互页面（这种页面本身要写代码，见方式二末尾）。
5. **Featured** 打开 = 出现在首页精选。
6. Save，等部署完成。

---

## 方式二：本地 markdown 文件

适合在 Obsidian / Typora / VS Code 里写作，或批量整理项目的时候。

### 博客 = 一个 md 文件

在 `src/content/blog/` 下新建 `my-post.md`（文件名就是网址后缀 `/blog/my-post`）：

```yaml
---
title: 文章标题
date: 2026-07-04
summary: 一句话摘要（列表页和 RSS 用）
draft: false        # true = 不发布
---

正文。图片放在同目录，用相对路径引用：![说明](./photo.jpg)
```

### 项目 = 一个文件夹

复制 `src/content/projects/` 里任意现有文件夹改名（文件夹名就是网址后缀），
放好图片，编辑 `index.md`：

```
src/content/projects/
  my-project/          ← 文件夹名 = URL slug
    index.md           ← 元信息 + 正文
    cover.png          ← 封面缩略图
    photo-1.jpg        ← 正文图片，相对路径引用
```

`index.md` 的 frontmatter 速查：

```yaml
---
title: 项目标题            # 必填
summary: 卡片上的一句话     # 必填
year: 2026                # 必填
tags: [data-viz]          # 选填，/work 页可按 tag 筛选
cover: ./cover.png        # 选填但强烈建议，网格缩略图
type: case-study          # case-study / custom / external，默认 case-study
href:                     # 仅 custom/external 需要（内部路径或完整 URL）
featured: false           # true = 上首页
draft: false              # true = 隐藏
order:                    # 选填数字，手动排序；默认按 year 倒序
---
```

### 提交上线

```sh
cd ~/personal-website
git add .
git commit -m "Add new project"
git push
```

没带电脑时的应急方案：直接在 GitHub 网页端（github.com/zerisinyu/personal-website）
进对应目录点 "Add file"，网页编辑器也支持拖拽传图。

---

## 图片、GIF、视频的规则

| 类型 | 放哪里 | 怎么引用 |
|---|---|---|
| 照片/截图 (png/jpg/webp) | 项目文件夹内 | `![说明](./photo.png)`，自动压缩优化 |
| **GIF 动图** | `public/projects/` | `<img src="/personal-website/projects/demo.gif" alt="说明">`（不能走优化管线，否则动画会丢） |
| **视频 (mp4)** | `public/projects/` | `.mdx` 里用 `<Video src="/projects/demo.mp4" />` |

## 需要更精细排版时（可选）

把项目的 `index.md` 改名为 `index.mdx`，以下组件直接可用（无需 import）：

```mdx
<Figure src="./big.png" caption="带说明的居中大图" />

<Gallery columns={2}>
  ![图一](./a.png)
  ![图二](./b.png)
</Gallery>

<TwoColumn>
  <div slot="left">左边文字…</div>
  <div slot="right">![右边图](./chart.png)</div>
</TwoColumn>

<FullBleed>![满宽出血图](./wide.png)</FullBleed>

<Video src="/projects/demo.mp4" caption="演示视频" />
```

## 自建交互页面（custom 项目）

1. 在 `src/pages/work/` 下写一个 `.astro` 页面（参考现有的
   `fertility-fairness.astro`，D3 等任意前端库都能用）。
2. 在 `src/content/projects/` 里为它建一个文件夹，`type: custom`，
   `href: /work/页面文件名`，配上封面图——这样它就出现在项目网格里。

## 常见问题

- **发布后看不到更新？** 等 1–2 分钟；或到仓库的 Actions 标签页看部署进度。
  浏览器强刷（Cmd+Shift+R）排除缓存。
- **想调整首页/网格顺序？** 默认按年份倒序；给项目加 `order: 1, 2, 3…` 手动排。
- **删除内容**：CMS 里打开条目点 Delete，或本地删掉文件/文件夹后提交推送。
- **RSS**：读者订阅 https://zerisinyu.github.io/personal-website/rss.xml，
  博客发布后自动更新，无需操作。
