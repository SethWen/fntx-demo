# fntx-demo 技术与实施规划

> 基于 `fntx` 核心引擎（复用 `fntx-napi` 浏览器端 WASM 产物）构建的纯前端在线字体处理工具站，面向公网免费静态托管（Cloudflare Pages），支持中英双语、亮暗主题切换及后续广告位嵌入。

---

## 1. 核心架构选型

- **框架**：Astro（静态站点生成 SSG） + React（交互岛 Islands） + TypeScript
- **样式**：Tailwind CSS（支持 `class="dark"` 亮暗主题切换）
- **包管理器**：`npm`
- **计算引擎**：复用 `fntx-napi` 编译出的 `wasm32-wasip1` 浏览器产物，封装在 **Web Worker** 中运行
- **托管平台**：Cloudflare Pages（无限静态流量、允许个人站点商用及挂载广告、支持自定义域名）

### 为什么直接复用 `fntx-napi` 的 WASM 产物？

1. **产物完备**：`crates/fntx-napi/dist/` 已包含 `fntx.wasip1-browser.js`（约 53 KB）、`fntx.wasm32-wasip1.wasm`（约 2.7 MB）和完整 TypeScript 类型定义 `index.d.ts`。
2. **兼容广告嵌入**：当前为单线程 `wasm32-wasip1`（非 `threads` 版），不依赖 `SharedArrayBuffer`，**无需开启 `COOP/COEP` 响应头**，不会拦截 Google AdSense 等第三方广告脚本与 iframe。
3. **零服务器成本**：所有字体解析、子集化、格式转换均在用户浏览器本地内存完成，大字体（如 19 MB 中文字库）不走服务器上传/下载带宽，无 Serverless 请求体大小限制。

---

## 2. 目录结构规划

```text
fntx-demo/
├── astro.config.mjs              # Astro + React + Tailwind + Vite(esnext / worker es) 配置
├── package.json
├── scripts/
│   └── sync-wasm.sh              # 从 ../fntx/crates/fntx-napi/dist 同步浏览器 WASM 产物
├── vendor/
│   └── fntx-wasm/                # 自包含 WASM 产物（确保 fntx-demo 独立推送到 GitHub 可直接构建）
│       ├── fntx.wasip1-browser.js
│       ├── fntx.wasm32-wasip1.wasm
│       └── index.d.ts
├── public/
│   └── robots.txt
└── src/
    ├── i18n/
    │   └── translations.ts       # 中英双语共享字典（Astro 静态页与 React 交互岛共用）
    ├── layouts/
    │   └── BaseLayout.astro      # 导航栏（语言/主题切换）、SEO Meta、页脚、广告槽位
    ├── components/
    │   ├── AdSlot.astro          # 广告位占位组件（通过 PUBLIC_ADSENSE_CLIENT 开关控制）
    │   └── workbench/            # React 交互岛（client:load）
    │       ├── FontWorkbench.tsx # 多 Tab 容器 + 全局已加载字体状态（切换功能免重复上传）
    │       ├── InspectPanel.tsx  # 字体体检（Family/PS Name、UPM、字形数、码点统计）
    │       ├── SubsetPanel.tsx   # 单/多源子集化、缺字报告（requested/covered/missing）、导出
    │       ├── ConvertPanel.tsx  # 格式互转（TTF/OTF/WOFF/WOFF2/EOT/SVG）+ 压缩率对比
    │       ├── TtcPanel.tsx      # TTC 集合信息、拆包（单/全部）、多字体打包去重
    │       └── FontPreview.tsx   # 基于浏览器 FontFace API 的实时渲染预览
    ├── workers/
    │   └── fntx.worker.ts        # Web Worker：懒加载 WASM 并执行耗时计算
    ├── lib/
    │   └── fntx-client.ts        # 主线程与 Worker 通信的 Promise 封装
    └── pages/
        ├── index.astro           # 中文首页（工作台交互岛 + 核心特性/FAQ）
        ├── formats.astro         # 中文：字体格式科普（TTF / WOFF2 / OTF / EOT / SVG / TTC）
        ├── guide.astro           # 中文：使用指南
        ├── privacy.astro         # 中文：隐私政策（强调 100% 本地处理不上传）
        └── en/
            ├── index.astro       # 英文首页
            ├── formats.astro     # 英文：字体格式科普
            ├── guide.astro       # 英文：使用指南
            └── privacy.astro     # 英文：隐私政策
```

---

## 3. 关键机制设计

### 3.1 Astro 与 React 混合协作边界

- **`.astro` 负责静态外壳与内容页**：导航、页脚、科普文档、FAQ、隐私政策、广告位均编译为纯静态 HTML，零额外 JS，最大化 SEO 收录与 AdSense 审核通过率。
- **`.tsx` 负责工作台交互岛**：所有字体处理功能集中在 `<FontWorkbench client:load lang={lang} />` 中，内部状态（已上传的 `Uint8Array`、处理结果）在 Tab 间无缝共享。
- **单向嵌套约定**：`.astro` 可引入 `.tsx`，`.tsx` 内部不反向 `import` `.astro`。

### 3.2 中英双语切换（i18n）

- **路由级多语言**：`/` 为默认中文路径，`/en/` 为英文路径，两个语种的科普与指南页各自拥有独立静态 URL，利于双语搜索引擎收录。
- **状态同步**：`.astro` 页面将 `lang: 'zh' | 'en'` 作为 prop 传入 `<FontWorkbench />`，静态页面与 React 工作台共用 `src/i18n/translations.ts`。
- **语言偏好**：导航栏切换按钮跳转到对应语种页面并记录 `localStorage`。

### 3.3 亮暗主题切换（Light / Dark）

- 在 `BaseLayout.astro` 的 `<head>` 中放置 `<script is:inline>`，在首屏渲染前读取 `localStorage` 或系统 `prefers-color-scheme`，直接操作 `<html class="dark">`，避免页面加载闪烁（FOUC）。
- Tailwind CSS 统一响应 `html.dark`，Astro 静态部分与 React 交互岛自动同步变色。

### 3.4 WASM 工程与性能注意点

- **自包含打包**：由于 `fntx-demo` 与 `fntx` 是两个独立仓库，采用 `scripts/sync-wasm.sh` 将产物同步到 `vendor/fntx-wasm/`，同时在 `package.json` 显式安装 `@napi-rs/wasm-runtime` 与 `@emnapi/runtime`，保证 Cloudflare Pages 拉取 `fntx-demo` 即可独立构建。
- **Top-level `await` 兼容**：`fntx.wasip1-browser.js` 使用了顶层 `await fetch(...)`，需在 `astro.config.mjs` 中设置 `vite.build.target = 'esnext'` 与 `vite.worker.format = 'es'`。
- **懒加载与内存观察**：Worker 在用户首次使用工作台功能时再拉取 `.wasm`；此外 `fntx.wasip1-browser.js` 初始分配 `WebAssembly.Memory({ initial: 4000, maximum: 65536 })`（约 250 MiB 初始线性内存），上线前需在移动端浏览器实测兼容性。
- **后续接口扩展点**：当前 `fntx-napi` 已导出 `inspect`、`convert`、`FontEngine`（`build` / `plan`）、`inspectTtc`、`sfntFromTtc`、`sfntsFromTtc`、`ttcFromSfnts`；若后续需要独立 `rename` 或查看完整码点列表（`covered_codepoints`），在 `crates/fntx-napi` 补充导出并执行 `sync-wasm.sh` 即可。

---

## 4. 广告嵌入与合规预留

- **占位设计**：在 `BaseLayout.astro` 及工具区下方预留 `<AdSlot />` 组件，远离“导出 / 下载”等操作按钮以防误触。
- **内容厚度**：提供中英双语的格式科普（`formats`）、使用指南（`guide`）与隐私政策（`privacy`），避免被 Google AdSense 判定为“低价值单页工具”。
- **环境切换**：未配置 `PUBLIC_ADSENSE_CLIENT` 时不加载外部广告脚本；正式上线绑定自有域名并过审后，配置环境变量即可启用。

---

## 5. 分阶段执行计划

### 阶段 1：工程初始化与 WASM Worker 跑通（MVP 验证）

- [ ] 使用 `npm` 初始化 Astro + React + Tailwind CSS 项目结构
- [ ] 编写 `scripts/sync-wasm.sh` 并同步 `fntx-napi` 浏览器 WASM 产物到 `vendor/fntx-wasm/`
- [ ] 配置 `astro.config.mjs`（`@astrojs/react`、`@tailwindcss/vite` / Tailwind、Vite `esnext` 与 Worker ES 格式）
- [ ] 实现 `src/workers/fntx.worker.ts` 与 `src/lib/fntx-client.ts`
- [ ] 在首页验证浏览器端 Worker 成功调用 `inspect` 和 `convert`（TTF -> WOFF2）

### 阶段 2：全功能工作台与主题/双语完善

- [ ] 实现 `BaseLayout.astro` 亮暗主题零闪烁切换与中英路由切换
- [ ] 实现 `InspectPanel`、`SubsetPanel`、`ConvertPanel`、`TtcPanel`
- [ ] 实现 `FontPreview`（`FontFace` API 实时渲染预览）与结果下载

### 阶段 3：静态内容页、SEO 与广告槽位

- [ ] 编写中英文 `formats`、`guide`、`privacy` 页面及 `sitemap` / `robots.txt`
- [ ] 接入 `AdSlot.astro` 预留槽位并检查移动端适配

### 阶段 4：测试与 Cloudflare Pages 部署

- [ ] 运行 `npm run build && npm run preview` 验证生产构建，桌面端 + 移动端真机测试大字体处理
- [ ] 推送 GitHub 并接入 Cloudflare Pages（构建命令：`npm run build`，输出目录：`dist`），绑定自定义域名
