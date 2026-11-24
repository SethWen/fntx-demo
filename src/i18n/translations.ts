export type Lang = 'zh' | 'en';

export interface Translations {
  siteName: string;
  tagline: string;
  nav: {
    workbench: string;
    formats: string;
    guide: string;
    privacy: string;
    switchLang: string;
    themeToggle: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  workbench: {
    tabs: {
      inspect: string;
      subset: string;
      convert: string;
      ttc: string;
    };
    engine: {
      idle: string;
      loading: string;
      ready: string;
      error: string;
    };
    dropzone: {
      title: string;
      subtitle: string;
      loaded: string;
      replace: string;
      clear: string;
      sampleHint: string;
    };
    inspect: {
      empty: string;
      containerFormat: string;
      ttcNotice: string;
      goToTtc: string;
      unsupportedNotice: string;
      familyName: string;
      postscriptName: string;
      unitsPerEm: string;
      glyphCount: string;
      codepointCount: string;
      outlineType: string;
      truetype: string;
      cff: string;
      fileSize: string;
    };
    subset: {
      title: string;
      cffWarning: string;
      goToConvert: string;
      ttcNotice: string;
      goToTtc: string;
      unsupportedNotice: string;
      extraSourceInvalid: string;
      textLabel: string;
      textPlaceholder: string;
      fontNameLabel: string;
      fontNamePlaceholder: string;
      formatsLabel: string;
      dropHinting: string;
      legacyTableStrip: string;
      strictMode: string;
      extraSourcesTitle: string;
      extraSourcesDesc: string;
      addSource: string;
      rangeStart: string;
      rangeEnd: string;
      run: string;
      running: string;
      coverage: string;
      missingCodepoints: string;
      noneMissing: string;
      download: string;
    };
    convert: {
      title: string;
      targetFormat: string;
      currentFormatTag: string;
      cffUnsupportedHint: string;
      ttcNotice: string;
      goToTtc: string;
      unsupportedNotice: string;
      run: string;
      running: string;
      originalSize: string;
      outputSize: string;
      ratio: string;
      download: string;
    };
    ttc: {
      title: string;
      unpackMode: string;
      packMode: string;
      unpackDesc: string;
      unpackNotTtc: string;
      packDesc: string;
      inspectBtn: string;
      unpackAllBtn: string;
      unpackOneBtn: string;
      useFaceBtn: string;
      packAddCurrent: string;
      packAddFiles: string;
      packBtn: string;
      version: string;
      fontCount: string;
      sharedTables: string;
      totalTables: string;
      uniqueTables: string;
      download: string;
    };
    preview: {
      title: string;
      placeholder: string;
      sizeLabel: string;
      loading: string;
      unsupported: string;
    };
  };
  ad: {
    label: string;
    placeholder: string;
  };
  footer: {
    localOnly: string;
    copyright: string;
  };
}

export const translations: Record<Lang, Translations> = {
  zh: {
    siteName: 'fntx Web',
    tagline: '纯前端 WASM 字体子集化与格式转换引擎',
    nav: {
      workbench: '工作台',
      formats: '格式科普',
      guide: '使用指南',
      privacy: '隐私政策',
      switchLang: 'English',
      themeToggle: '切换亮暗主题',
    },
    hero: {
      badge: '100% 浏览器本地处理 · 零上传',
      title: '高性能在线字体子集化与格式转换',
      subtitle:
        '基于 Rust 与 WebAssembly 驱动，直接在浏览器内完成字体体检、按需裁剪、多源合并、TTF/WOFF2/OTF/EOT/SVG 互转及 TTC 拆装。',
    },
    workbench: {
      tabs: {
        inspect: '字体体检',
        subset: '子集化 / 合并',
        convert: '格式转换',
        ttc: 'TTC 集合',
      },
      engine: {
        idle: '引擎待命（首次处理自动加载）',
        loading: '正在加载 WASM 引擎...',
        ready: 'WASM 引擎就绪',
        error: '引擎加载失败',
      },
      dropzone: {
        title: '拖拽字体文件到此处，或点击选择',
        subtitle: '支持 .ttf / .otf / .woff / .woff2 / .eot / .ttc，所有计算仅在本地内存运行',
        loaded: '当前字体',
        replace: '更换字体',
        clear: '清除',
        sampleHint: '提示：加载后可在上方各功能标签间无缝切换，无需重复上传',
      },
      inspect: {
        empty: '请先上传一个单字体文件（TTF/OTF/WOFF/WOFF2/EOT）查看元数据。',
        containerFormat: '容器格式',
        ttcNotice: '当前文件为 TTC 字体集合，请前往「TTC 集合」拆解出单个字体后再进行体检或处理。',
        goToTtc: '前往 TTC 集合',
        unsupportedNotice: '当前文件格式不支持元数据体检（SVG 仅支持作为输出格式）。',
        familyName: '家族名称 (Family)',
        postscriptName: 'PostScript 名称',
        unitsPerEm: 'UPM (Units Per Em)',
        glyphCount: '字形总数 (Glyphs)',
        codepointCount: 'Unicode 码点数',
        outlineType: '轮廓类型',
        truetype: 'TrueType (二次贝塞尔)',
        cff: 'CFF / OpenType (三次贝塞尔)',
        fileSize: '文件体积',
      },
      subset: {
        title: '按需提取字符子集（支持多源扩展区合并）',
        cffWarning:
          '当前字体为 CFF 轮廓（OTF），暂不支持子集化（仅支持 TrueType 轮廓），可前往格式转换生成 WOFF / WOFF2 / SVG。',
        goToConvert: '前往格式转换',
        ttcNotice: '当前文件为 TTC 字体集合，请先在「TTC 集合」提取单个 TrueType 字体。',
        goToTtc: '前往 TTC 集合',
        unsupportedNotice: '当前文件格式不支持子集化构建。',
        extraSourceInvalid:
          '补充字体源必须是 TrueType (glyf) 单字体（支持 TTF / WOFF / WOFF2 / EOT）。',
        textLabel: '输入需要保留的字符',
        textPlaceholder: '例如：你好世界 fntx 0123456789 𠀀',
        fontNameLabel: '输出字体名称（可选）',
        fontNamePlaceholder: '留空则沿用原字体名',
        formatsLabel: '输出格式',
        dropHinting: '剔除 Hinting 提示指令（减小体积）',
        legacyTableStrip: '精简冗余布局表',
        strictMode: '严格模式（遇缺字报错）',
        extraSourcesTitle: '额外补充字体源（可选，用于 BMP + SIP 生僻字合并）',
        extraSourcesDesc: '主字体默认覆盖 0x00000 - 0x0FFFF，可按 Unicode 区间追加补充字库',
        addSource: '添加补充字体源',
        rangeStart: '起始码点 (Hex)',
        rangeEnd: '结束码点 (Hex)',
        run: '开始构建子集',
        running: '正在子集化...',
        coverage: '字符覆盖率',
        missingCodepoints: '缺失码点',
        noneMissing: '无缺失字符',
        download: '下载',
      },
      convert: {
        title: '单字体格式互转',
        targetFormat: '目标格式',
        currentFormatTag: '当前',
        cffUnsupportedHint: '当前字体为 CFF 轮廓（OTF），暂不支持转换为 TTF 或 EOT。',
        ttcNotice: '当前文件为 TTC 字体集合，请先在「TTC 集合」提取单个字体后再转换格式。',
        goToTtc: '前往 TTC 集合',
        unsupportedNotice: '当前文件格式不支持转换。',
        run: '开始转换',
        running: '正在转换...',
        originalSize: '原始体积',
        outputSize: '输出体积',
        ratio: '体积变化',
        download: '下载转换结果',
      },
      ttc: {
        title: 'TTC 字体集合拆解与打包',
        unpackMode: '拆解 TTC (.ttc -> .ttf/.otf)',
        packMode: '打包 TTC (多字体 -> .ttc)',
        unpackDesc:
          '上传 .ttc 文件自动解析内部子字体与表去重统计，可提取下载或直接送入工作台处理。',
        unpackNotTtc: '当前加载的不是 TTC 集合文件；你可以切换到「打包 TTC」将其加入集合。',
        packDesc:
          '选择 2 个及以上单字体文件（TTF / OTF / WOFF / WOFF2 / EOT），自动去重共享表并打包为 .ttc。',
        inspectBtn: '解析 TTC 结构',
        unpackAllBtn: '全部拆解提取',
        unpackOneBtn: '提取',
        useFaceBtn: '设为当前字体',
        packAddCurrent: '加入当前加载的字体',
        packAddFiles: '添加多个单字体文件 (.ttf / .otf / .woff / .woff2 / .eot)',
        packBtn: '打包为 TTC',
        version: '容器版本',
        fontCount: '子字体数量',
        sharedTables: '共享表数量',
        totalTables: '总表数',
        uniqueTables: '唯一表数',
        download: '下载',
      },
      preview: {
        title: '即时渲染预览',
        placeholder: '在这里输入任意文字，实时预览处理后字体的渲染效果…… 0123456789 ABCabc',
        sizeLabel: '字号',
        loading: '正在加载预览字体...',
        unsupported: '当前格式（如 EOT/SVG）浏览器 FontFace 不支持直接预览，请下载后使用。',
      },
    },
    ad: {
      label: '赞助与广告位',
      placeholder: '广告位预留（部署并配置 PUBLIC_ADSENSE_CLIENT 后自动展示）',
    },
    footer: {
      localOnly: '所有字体均在本地浏览器 WebAssembly 沙箱中处理，绝不上传至任何服务器。',
      copyright: '基于 fntx 引擎构建',
    },
  },
  en: {
    siteName: 'fntx Web',
    tagline: 'Client-side WASM Font Subsetter & Format Converter',
    nav: {
      workbench: 'Workbench',
      formats: 'Formats',
      guide: 'Guide',
      privacy: 'Privacy',
      switchLang: '中文',
      themeToggle: 'Toggle Light/Dark Theme',
    },
    hero: {
      badge: '100% Client-Side · Zero Server Upload',
      title: 'Fast In-Browser Font Subsetting & Conversion',
      subtitle:
        'Powered by Rust & WebAssembly. Inspect metadata, subset & merge multi-plane fonts, convert between TTF/WOFF2/OTF/EOT/SVG, and pack/unpack TTC collections locally.',
    },
    workbench: {
      tabs: {
        inspect: 'Inspect',
        subset: 'Subset / Merge',
        convert: 'Convert',
        ttc: 'TTC Tools',
      },
      engine: {
        idle: 'Engine idle (loads on first task)',
        loading: 'Loading WASM engine...',
        ready: 'WASM engine ready',
        error: 'Engine failed to load',
      },
      dropzone: {
        title: 'Drop a font file here, or click to browse',
        subtitle:
          'Supports .ttf / .otf / .woff / .woff2 / .eot / .ttc. Processed strictly in local memory.',
        loaded: 'Active Font',
        replace: 'Replace',
        clear: 'Clear',
        sampleHint: 'Tip: Switch tabs above freely without re-uploading your font.',
      },
      inspect: {
        empty: 'Upload a single font file (TTF/OTF/WOFF/WOFF2/EOT) to inspect its metadata.',
        containerFormat: 'Container Format',
        ttcNotice: 'This file is a TTC collection. Open TTC Tools to unpack a face first.',
        goToTtc: 'Go to TTC Tools',
        unsupportedNotice:
          'Metadata inspection is not supported for this format (SVG is output-only).',
        familyName: 'Family Name',
        postscriptName: 'PostScript Name',
        unitsPerEm: 'Units Per Em (UPM)',
        glyphCount: 'Glyph Count',
        codepointCount: 'Unicode Codepoints',
        outlineType: 'Outline Format',
        truetype: 'TrueType (Quadratic Bézier)',
        cff: 'CFF / OpenType (Cubic Bézier)',
        fileSize: 'File Size',
      },
      subset: {
        title: 'Subset Characters (with optional multi-source merge)',
        cffWarning:
          'CFF (OTF) outlines are not supported for subsetting yet (TrueType only). You can convert to WOFF / WOFF2 / SVG instead.',
        goToConvert: 'Go to Convert',
        ttcNotice:
          'This file is a TTC collection. Unpack a single TrueType face in TTC Tools first.',
        goToTtc: 'Go to TTC Tools',
        unsupportedNotice: 'This file format is not supported for subsetting.',
        extraSourceInvalid:
          'Additional source must be a TrueType (glyf) single font (TTF / WOFF / WOFF2 / EOT).',
        textLabel: 'Characters to keep',
        textPlaceholder: 'e.g. Hello World 你好世界 0123456789 𠀀',
        fontNameLabel: 'Custom Font Name (optional)',
        fontNamePlaceholder: 'Leave empty to keep original name',
        formatsLabel: 'Output Formats',
        dropHinting: 'Drop hinting instructions (smaller size)',
        legacyTableStrip: 'Strip redundant layout tables',
        strictMode: 'Strict mode (fail on missing codepoints)',
        extraSourcesTitle: 'Additional Font Sources (optional, for BMP + SIP merge)',
        extraSourcesDesc:
          'Primary font defaults to 0x00000 - 0x0FFFF. Add supplementary fonts by Unicode range.',
        addSource: 'Add Source',
        rangeStart: 'Start (Hex)',
        rangeEnd: 'End (Hex)',
        run: 'Build Subset',
        running: 'Subsetting...',
        coverage: 'Coverage',
        missingCodepoints: 'Missing Codepoints',
        noneMissing: 'None missing',
        download: 'Download',
      },
      convert: {
        title: 'Font Format Conversion',
        targetFormat: 'Target Format',
        currentFormatTag: 'Current',
        cffUnsupportedHint: 'CFF (OTF) outlines cannot be converted to TTF or EOT.',
        ttcNotice: 'This file is a TTC collection. Unpack a single face in TTC Tools first.',
        goToTtc: 'Go to TTC Tools',
        unsupportedNotice: 'This file format is not supported for conversion.',
        run: 'Convert Font',
        running: 'Converting...',
        originalSize: 'Original Size',
        outputSize: 'Output Size',
        ratio: 'Size Change',
        download: 'Download Output',
      },
      ttc: {
        title: 'TTC Collection Unpack & Pack',
        unpackMode: 'Unpack TTC (.ttc -> .ttf/.otf)',
        packMode: 'Pack TTC (Fonts -> .ttc)',
        unpackDesc:
          'Inspect a .ttc collection automatically, extract faces, or load any face into the workbench.',
        unpackNotTtc: 'Current file is not a TTC collection. Switch to Pack TTC to include it.',
        packDesc:
          'Select 2 or more single font files (TTF / OTF / WOFF / WOFF2 / EOT) to pack into a .ttc.',
        inspectBtn: 'Inspect TTC',
        unpackAllBtn: 'Unpack All Faces',
        unpackOneBtn: 'Extract',
        useFaceBtn: 'Use in Workbench',
        packAddCurrent: 'Add current font',
        packAddFiles: 'Add font files (.ttf / .otf / .woff / .woff2 / .eot)',
        packBtn: 'Pack into TTC',
        version: 'Version',
        fontCount: 'Face Count',
        sharedTables: 'Shared Tables',
        totalTables: 'Total Tables',
        uniqueTables: 'Unique Tables',
        download: 'Download',
      },
      preview: {
        title: 'Live Font Preview',
        placeholder: 'Type here to preview the processed font in real time... 0123456789 ABCabc',
        sizeLabel: 'Size',
        loading: 'Loading preview font...',
        unsupported: 'Browser FontFace preview is unavailable for this format (e.g. EOT/SVG).',
      },
    },
    ad: {
      label: 'Advertisement',
      placeholder: 'Ad slot reserved (set PUBLIC_ADSENSE_CLIENT to activate)',
    },
    footer: {
      localOnly:
        'All fonts are processed locally in your browser WebAssembly sandbox and never uploaded.',
      copyright: 'Powered by fntx',
    },
  },
};
