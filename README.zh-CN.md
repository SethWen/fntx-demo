<div align="center">
  <img src="./public/favicon.svg" width="72" height="72" alt="fntx logo" />
  <h1>fntx Web</h1>
  <p><strong>纯前端 · 零上传 · WebAssembly 驱动的在线字体处理工作台</strong></p>
  <p>
    在线体验：<a href="https://fntx.modone.me/cn/"><strong>https://fntx.modone.me/cn/</strong></a>
    （<a href="https://fntx.modone.me/">English</a>）
  </p>
  <p>
    <a href="./README.md">English</a> | <strong>简体中文</strong>
  </p>
</div>

**fntx Web** 是基于 [`fntx`](<>) Rust 核心引擎构建的浏览器端在线字体处理工具站。所有字体解析、裁剪、合并与格式转换均在用户浏览器本地 **WebAssembly + Web Worker** 沙箱中完成，无需将动辄数十 MB 的字库上传至任何服务器，兼顾处理速度与文件隐私安全。

---

## 核心功能

- **多源子集化与跨区合并（Subset & Merge）**
  - 按需输入字符或 Unicode 码点，将 15MB–30MB 的大型中文字库裁剪至几十 KB。
  - 支持 **BMP 基本区（`00000–0FFFF`）** 与 **SIP 生僻字扩展区（`20000–2FFFF` 等）** 多源独立裁剪并自动合并为单一字体。
  - 提供精确的 `requested / covered / missing` 字符覆盖率与缺字报告。
  - 支持开启「剔除 Hinting / 冗余表瘦身」进一步压缩产物体积。
- **全格式本地互转（Format Conversion）**
  - 单次操作即可输出 **TTF、WOFF2、WOFF、OTF（TrueType 二次贝塞尔精确提升为 CFF 三次贝塞尔）、EOT、SVG**，并实时展示压缩率对比。
- **TTC 字体集合无损拆装（TTC Pack & Unpack）**
  - 可视化探测 `.ttc` 容器内部子字体列表与表共享（去重）统计。
  - 支持提取单个或全部子字体为独立 SFNT，也支持将多款字体去重打包为 `.ttc`。
- **字体体检与实时渲染预览（Inspect & Preview）**
  - 一键查看 Family / PostScript 名称、UPM、字形数、码点覆盖及轮廓类型。
  - 基于浏览器 `FontFace` API，处理完成后可直接在页面内输入文本预览实际渲染效果。

---

## 产品特性

- **100% 本地隐私安全**：所有字体字节仅在浏览器本地内存中处理，不经过任何后端服务器，页面加载后即使断网亦可正常使用。
- **高性能 WebAssembly 引擎**：底层复用 `fntx` Rust 引擎，在独立 Web Worker 线程中运行，处理大字库不阻塞界面交互。
- **中英双语 & 亮暗主题**：完整支持英文（`/`）与简体中文（`/cn/`）双语切换，以及无闪烁的亮色 / 暗色主题切换。
- **内置格式科普与使用指南**：提供常见 Web/桌面字体格式对比（`/cn/formats/`）及多源子集化 FAQ（`/cn/guide/`）。

---

## 技术栈

- **前端框架**：Astro（SSG 静态站点生成） + React（交互式工作台） + TypeScript + Tailwind CSS
- **计算核心**：`fntx` 编译为 `wasm32-wasip1` 浏览器端产物（封装于 Web Worker）
- **部署托管**：Cloudflare Pages

---

## 本地开发与部署

```bash
# 安装依赖
pnpm install

# 启动本地开发服务器
pnpm dev

# 代码检查（lint + format + tsc）与生产构建
pnpm check && pnpm build

# 部署到 Cloudflare Pages
pnpm deploy
```
