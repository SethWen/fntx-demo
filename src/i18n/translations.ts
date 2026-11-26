export type Lang = 'zh' | 'en';

export interface SeoCopy {
  title: string;
  description: string;
}

export interface FeatureCopy {
  title: string;
  body: string;
}

export interface StepCopy {
  title: string;
  body: string;
}

export interface Translations {
  siteName: string;
  siteBadge: string;
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
  home: {
    workbenchHeading: string;
    featuresTitle: string;
    features: FeatureCopy[];
    stepsTitle: string;
    steps: StepCopy[];
  };
  seo: {
    home: SeoCopy;
    subset: SeoCopy;
    convert: SeoCopy;
    ttc: SeoCopy;
    formats: SeoCopy;
    guide: SeoCopy;
    glossary: SeoCopy;
    about: SeoCopy;
    privacy: SeoCopy;
  };
  workbench: {
    heading: string;
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
      advancedParams: string;
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
      formatsHint: string;
      advancedOptions: string;
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
      formatsHint: string;
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
  };
  breadcrumb: {
    home: string;
  };
  footer: {
    localOnly: string;
    copyright: string;
    groups: {
      tools: string;
      learn: string;
      about: string;
    };
    links: {
      home: string;
      subset: string;
      convert: string;
      ttc: string;
      formats: string;
      guide: string;
      glossary: string;
      about: string;
      privacy: string;
    };
  };
}

export const translations: Record<Lang, Translations> = {
  zh: {
    siteName: 'Fntx Web',
    siteBadge: '本地处理',
    tagline: '在线字体工具箱：瘦身、转换、合并，全程本地完成',
    nav: {
      workbench: '工作台',
      formats: '字体格式',
      guide: '使用指南',
      privacy: '隐私政策',
      switchLang: 'EN',
      themeToggle: '切换亮暗主题',
    },
    hero: {
      badge: '全程本地处理 · 文件不上传',
      title: '在线字体瘦身与格式转换',
      subtitle:
        '把几十 MB 的大字库压到几十 KB，网页加载更快；常用格式一键互转；一个合集拆成单文件，或多个字体打包成一个。文件不出电脑。',
    },
    home: {
      workbenchHeading: '在线字体处理工作台',
      featuresTitle: '能帮你做什么',
      features: [
        {
          title: '让中文字体变小',
          body: '只保留网页实际用到的字。具体能小多少取决于用字量，通常可以从几十 MB 降到几十 KB。',
        },
        {
          title: '一键换格式',
          body: 'TTF、OTF、WOFF2 等常用格式互相转换，做网页优先选 WOFF2。',
        },
        {
          title: '拆开或打包字体合集',
          body: '一个文件里装着好几套字体，可以拆成单个；多个字体也能打包成一个。',
        },
      ],
      stepsTitle: '三步搞定',
      steps: [
        {
          title: '拖入字体',
          body: '把 TTF、OTF、WOFF、WOFF2 或 TTC 文件拖进上方区域。',
        },
        {
          title: '选择操作',
          body: '瘦身、换格式或拆装合集，改完可以立即预览效果。',
        },
        {
          title: '下载结果',
          body: '确认满意后下载新文件，原文件不会被改动。',
        },
      ],
    },
    seo: {
      home: {
        title: '在线字体工具：字体瘦身与格式转换 - fntx',
        description:
          '免费在线给字体瘦身、转换格式：只保留用到的字，中文字库从几十 MB 压到几十 KB；支持 TTF、OTF、WOFF2、TTC，全程本地处理、不上传文件。',
      },
      subset: {
        title: 'CJK 字体子集化工具：只保留网页用到的字 - fntx',
        description:
          '在线给中文字体瘦身：粘贴网页用到的文字，只保留需要的字符，导出 WOFF2 或 TTF。支持补充生僻字字库，全程本地处理。',
      },
      convert: {
        title: 'TTF 转 WOFF2、OTF 转 TTF 在线转换 - fntx',
        description:
          '在线转换字体格式：TTF、OTF、WOFF、WOFF2、EOT、SVG 互相转换，网页优先 WOFF2，文件不上传。',
      },
      ttc: {
        title: 'TTC 拆分与打包：字体合集处理工具 - fntx',
        description:
          '在线拆开或打包 TTC 字体合集：提取单个字体，或把多个字体合并成一个文件，重复数据只存一份。',
      },
      glossary: {
        title: '字体术语词典：子集化、WOFF2、TTC 是什么 - fntx',
        description:
          '用大白话解释字体瘦身、WOFF2、TTF、OTF、TTC、Hinting 等常见术语，附对应工具入口。',
      },
      about: {
        title: '关于 Fntx Web：为什么做这个字体工具 - fntx',
        description:
          '了解 Fntx Web 是谁做的、为什么坚持本地处理、如何保证字体文件不上传，以及项目开源与联系方式。',
      },
      formats: {
        title: '字体格式对比：TTF、OTF、WOFF2 怎么选？ - fntx',
        description:
          '一张表看懂常见字体格式：WOFF2 为什么适合网页、TTF 和 OTF 有什么区别、TTC 是什么，附选型建议。',
      },
      guide: {
        title: '字体瘦身与格式转换指南（常见问题） - fntx',
        description:
          '网页中文字体加载慢？生僻字显示不出来？了解如何在线给字体瘦身、补充生僻字、转换格式、拆分字体合集，以及文件为什么不会被上传。',
      },
      privacy: {
        title: '隐私政策 - fntx',
        description:
          'fntx 如何处理你的字体文件和个人信息：所有处理都在浏览器本地完成，字体不会上传。',
      },
    },
    workbench: {
      heading: '在线字体处理工作台',
      tabs: {
        inspect: '字体体检',
        subset: '字体瘦身',
        convert: '格式转换',
        ttc: '字体合集',
      },
      engine: {
        idle: '准备就绪（首次使用会自动加载）',
        loading: '正在准备，请稍候…',
        ready: '准备好了，可以开始',
        error: '处理程序加载失败，请刷新重试',
      },
      dropzone: {
        title: '把字体文件拖到这里，或点击选择',
        subtitle:
          '支持 TTF、OTF、WOFF、WOFF2、EOT、TTC。所有处理都在你的浏览器里完成，文件不会上传。',
        loaded: '当前字体',
        replace: '更换字体',
        clear: '清除',
        sampleHint: '提示：切换上面的功能不需要重新上传',
      },
      inspect: {
        empty: '先拖入一个字体文件，就能看到它的信息。',
        containerFormat: '文件格式',
        ttcNotice: '这是一个字体合集文件，请先到「字体合集」里选一个字体出来。',
        goToTtc: '前往字体合集',
        unsupportedNotice: '这个文件无法查看字体信息（SVG 只能作为输出格式）。',
        familyName: '字体名称',
        postscriptName: '字体英文名（PostScript）',
        unitsPerEm: '设计单位（UPM）',
        glyphCount: '字形数量',
        codepointCount: '收录字符数',
        outlineType: '字形类型',
        truetype: '标准字形（TrueType）',
        cff: '印刷字形（CFF）',
        fileSize: '文件大小',
        advancedParams: '高级参数',
      },
      subset: {
        title: '只保留你要用的字',
        cffWarning: '这个字体暂时不能瘦身（目前仅支持 TTF 类型）。可以先去「格式转换」转成 TTF。',
        goToConvert: '前往格式转换',
        ttcNotice: '这是一个字体合集文件，请先在「字体合集」里选一个字体出来。',
        goToTtc: '前往字体合集',
        unsupportedNotice: '这个文件暂时不能瘦身。',
        extraSourceInvalid: '补充字库需要是 TTF、WOFF、WOFF2 或 EOT 格式的单字体文件。',
        textLabel: '要保留的文字',
        textPlaceholder: '例如：你好世界 fntx 0123456789 𠀀',
        fontNameLabel: '新字体名称（可选）',
        fontNamePlaceholder: '留空就沿用原字体名',
        formatsLabel: '输出格式',
        formatsHint: '做网页选 WOFF2，装到电脑或 App 选 TTF。',
        advancedOptions: '高级选项',
        dropHinting: '更彻底压缩（省略字体微调细节）',
        legacyTableStrip: '省略多余数据',
        strictMode: '缺字时提醒我',
        extraSourcesTitle: '补充生僻字字库（可选）',
        extraSourcesDesc: '主字体通常已包含常用汉字；需要生僻字时，可以再加一个字库文件。',
        addSource: '添加字库',
        rangeStart: '起始范围',
        rangeEnd: '结束范围',
        run: '开始瘦身',
        running: '正在处理…',
        coverage: '收录情况',
        missingCodepoints: '缺少的字',
        noneMissing: '需要的字都在里面',
        download: '下载',
      },
      convert: {
        title: '把字体换成另一种格式',
        targetFormat: '想换成',
        formatsHint: '做网页选 WOFF2；装到电脑或 App 选 TTF；印刷设计选 OTF。',
        currentFormatTag: '当前',
        cffUnsupportedHint: '这个字体不能直接转成 EOT。可以先转成 TTF，或者选择 WOFF、WOFF2、SVG。',
        ttcNotice: '这是一个字体合集文件，请先在「字体合集」里选一个字体出来。',
        goToTtc: '前往字体合集',
        unsupportedNotice: '这个文件暂时不能转换格式。',
        run: '开始转换',
        running: '正在转换…',
        originalSize: '原文件',
        outputSize: '新文件',
        ratio: '体积变化',
        download: '下载新字体',
      },
      ttc: {
        title: '字体合集：拆开或打包',
        unpackMode: '拆开合集',
        packMode: '打包合集',
        unpackDesc:
          '有些字体文件里装着好几套字体。这里可以把它们拆成单个字体，也可以先看看里面都有什么。',
        unpackNotTtc: '当前文件不是字体合集。想把它打包进合集，请切换到「打包合集」。',
        packDesc: '选两个或更多字体文件，打包成一个字体合集，重复的数据只存一份。',
        inspectBtn: '看看里面有什么',
        unpackAllBtn: '全部拆开',
        unpackOneBtn: '提取',
        useFaceBtn: '用此字体继续处理',
        packAddCurrent: '加入当前字体',
        packAddFiles: '添加字体文件',
        packBtn: '打包成一个文件',
        version: '格式版本',
        fontCount: '包含字体数',
        sharedTables: '共享数据项',
        totalTables: '数据项总数',
        uniqueTables: '独立数据项',
        download: '下载',
      },
      preview: {
        title: '预览效果',
        placeholder: '在这里输入文字，看看字体长什么样… 0123456789 ABCabc',
        sizeLabel: '字号',
        loading: '正在准备预览…',
        unsupported: '这个格式无法在网页里直接预览，请下载后查看。',
      },
    },
    ad: {
      label: '赞助与广告位',
    },
    breadcrumb: {
      home: '首页',
    },
    footer: {
      localOnly: '所有处理都在你的浏览器里完成，字体不会上传。',
      copyright: '由 fntx 提供支持',
      groups: {
        tools: '工具',
        learn: '了解字体',
        about: '关于',
      },
      links: {
        home: '字体工作台',
        subset: '字体瘦身',
        convert: '格式转换',
        ttc: '字体合集',
        formats: '字体格式对比',
        guide: '使用指南',
        glossary: '字体术语词典',
        about: '关于我们',
        privacy: '隐私政策',
      },
    },
  },
  en: {
    siteName: 'Fntx Web',
    siteBadge: 'local',
    tagline: 'Free online font toolkit — shrink, convert, merge',
    nav: {
      workbench: 'Workbench',
      formats: 'Font Formats',
      guide: 'Guide',
      privacy: 'Privacy',
      switchLang: '中',
      themeToggle: 'Toggle Light/Dark Theme',
    },
    hero: {
      badge: 'Runs locally · Your files never upload',
      title: 'Online Font Toolkit: Subset & Convert in Your Browser',
      subtitle:
        'Cut a 20 MB CJK font down to a few KB. Convert formats, split font collections, or bundle several fonts into one — all in your browser.',
    },
    home: {
      workbenchHeading: 'Online font workbench',
      featuresTitle: 'What you can do',
      features: [
        {
          title: 'Make CJK fonts smaller',
          body: 'Keep only the characters your site actually uses. How small it gets depends on the text — often from tens of MB down to tens of KB.',
        },
        {
          title: 'Switch formats in one click',
          body: 'Convert between TTF, OTF, WOFF2 and more. For websites, WOFF2 is usually the best choice.',
        },
        {
          title: 'Split or bundle font collections',
          body: 'Pull individual fonts out of one collection file, or pack several fonts into a single file.',
        },
      ],
      stepsTitle: 'Three steps',
      steps: [
        {
          title: 'Drop a font',
          body: 'Drag a TTF, OTF, WOFF, WOFF2 or TTC file into the area above.',
        },
        {
          title: 'Pick an action',
          body: 'Shrink it, convert it, or split/pack a collection — preview the result right away.',
        },
        {
          title: 'Download the result',
          body: 'Download the new file when it looks right. Your original file stays untouched.',
        },
      ],
    },
    seo: {
      home: {
        title: 'Online Font Toolkit: Subset, Convert & Merge | fntx',
        description:
          'Shrink CJK fonts to only the characters you need and convert between TTF, OTF, WOFF2, WOFF, EOT, SVG, and TTC. Free and fully in-browser — files never upload.',
      },
      subset: {
        title: 'CJK Font Subsetter: Keep Only the Characters You Need | fntx',
        description:
          'Shrink CJK fonts online: paste the text your site uses, keep only those characters, and export WOFF2 or TTF. Add a rare-character font when needed — all in your browser.',
      },
      convert: {
        title: 'TTF to WOFF2, OTF to TTF Converter Online | fntx',
        description:
          'Convert font formats online: TTF, OTF, WOFF, WOFF2, EOT and SVG. Use WOFF2 for the web. Files never upload.',
      },
      ttc: {
        title: 'TTC Extractor & Font Collection Packer | fntx',
        description:
          'Split a TTC font collection into individual fonts, or pack several fonts into one file with shared data stored once — right in your browser.',
      },
      glossary: {
        title: 'Font Glossary: Subsetting, WOFF2, TTC & More | fntx',
        description:
          'Plain-language definitions of font subsetting, WOFF2, TTF, OTF, TTC, hinting and other terms, with links to the matching tool.',
      },
      about: {
        title: 'About Fntx Web — Why We Built This Font Tool | fntx',
        description:
          'Who builds Fntx Web, why it runs entirely in your browser, how your font files stay private, and how to get in touch.',
      },
      formats: {
        title: 'Font Formats Explained: TTF vs OTF vs WOFF2 vs TTC | fntx',
        description:
          'Compare TTF, OTF, WOFF, WOFF2, EOT, SVG and TTC — what each format is for, and which one keeps your web fonts smallest.',
      },
      guide: {
        title: 'Font Subsetting & Conversion Guide — FAQ | fntx',
        description:
          'Learn how to shrink CJK fonts for the web, add rare characters, convert formats, and split font collections — plus why your files never leave your browser.',
      },
      privacy: {
        title: 'Privacy Policy | fntx',
        description:
          'How fntx handles your fonts and personal data: everything runs locally in your browser, and your font files are never uploaded.',
      },
    },
    workbench: {
      heading: 'Online font workbench',
      tabs: {
        inspect: 'Inspect',
        subset: 'Shrink Font',
        convert: 'Convert',
        ttc: 'Collections',
      },
      engine: {
        idle: 'Ready (loads automatically on first use)',
        loading: 'Getting ready, please wait…',
        ready: 'Ready to go',
        error: 'Could not load the processing module. Please refresh and try again.',
      },
      dropzone: {
        title: 'Drop a font file here, or click to browse',
        subtitle:
          'Supports TTF, OTF, WOFF, WOFF2, EOT and TTC. Everything runs in your browser — files never upload.',
        loaded: 'Current font',
        replace: 'Replace',
        clear: 'Clear',
        sampleHint: 'Tip: switch tools above without uploading again',
      },
      inspect: {
        empty: 'Drop a font file to see what is inside it.',
        containerFormat: 'File format',
        ttcNotice:
          'This is a font collection. Open Collections first and pick a single font from it.',
        goToTtc: 'Go to Collections',
        unsupportedNotice: 'Font details are not available for this file (SVG is output-only).',
        familyName: 'Font name',
        postscriptName: 'PostScript name',
        unitsPerEm: 'Design units (UPM)',
        glyphCount: 'Glyph count',
        codepointCount: 'Characters included',
        outlineType: 'Outline type',
        truetype: 'TrueType outlines',
        cff: 'CFF (print) outlines',
        fileSize: 'File size',
        advancedParams: 'Advanced details',
      },
      subset: {
        title: 'Keep only the characters you need',
        cffWarning: 'This font cannot be shrunk yet (TrueType only). Convert it to TTF first.',
        goToConvert: 'Go to Convert',
        ttcNotice: 'This is a font collection. Pick a single font in Collections first.',
        goToTtc: 'Go to Collections',
        unsupportedNotice: 'This file cannot be shrunk yet.',
        extraSourceInvalid:
          'The extra font must be a single TrueType font (TTF, WOFF, WOFF2 or EOT).',
        textLabel: 'Characters to keep',
        textPlaceholder: 'e.g. Hello World 你好世界 0123456789 𠀀',
        fontNameLabel: 'New font name (optional)',
        fontNamePlaceholder: 'Leave empty to keep the original name',
        formatsLabel: 'Output formats',
        formatsHint: 'WOFF2 for websites; TTF for installing on a computer or in an app.',
        advancedOptions: 'Advanced options',
        dropHinting: 'Compress harder (skip fine-tuning hints)',
        legacyTableStrip: 'Drop extra data',
        strictMode: 'Warn me about missing characters',
        extraSourcesTitle: 'Add a font for rare characters (optional)',
        extraSourcesDesc:
          'Most fonts already cover common characters. Add another font file only when you need rare ones.',
        addSource: 'Add font',
        rangeStart: 'Start range',
        rangeEnd: 'End range',
        run: 'Shrink font',
        running: 'Working…',
        coverage: 'Characters included',
        missingCodepoints: 'Missing characters',
        noneMissing: 'Everything you need is included',
        download: 'Download',
      },
      convert: {
        title: 'Turn this font into another format',
        targetFormat: 'Convert to',
        formatsHint: 'WOFF2 for websites, TTF for desktop/apps, OTF for print design.',
        currentFormatTag: 'current',
        cffUnsupportedHint:
          'This font cannot be converted to EOT directly. Convert it to TTF first, or choose WOFF, WOFF2 or SVG.',
        ttcNotice: 'This is a font collection. Pick a single font in Collections first.',
        goToTtc: 'Go to Collections',
        unsupportedNotice: 'This file cannot be converted right now.',
        run: 'Convert font',
        running: 'Converting…',
        originalSize: 'Original',
        outputSize: 'New file',
        ratio: 'Size change',
        download: 'Download new font',
      },
      ttc: {
        title: 'Font collections: split or bundle',
        unpackMode: 'Split collection',
        packMode: 'Bundle fonts',
        unpackDesc:
          'Some font files contain several fonts. Split them into individual fonts here, or take a look inside first.',
        unpackNotTtc: 'This file is not a collection. To add it to one, switch to “Bundle fonts”.',
        packDesc: 'Choose two or more font files to pack them into one collection file.',
        inspectBtn: 'See what is inside',
        unpackAllBtn: 'Split all',
        unpackOneBtn: 'Extract',
        useFaceBtn: 'Continue with this font',
        packAddCurrent: 'Add current font',
        packAddFiles: 'Add font files',
        packBtn: 'Pack into one file',
        version: 'Format version',
        fontCount: 'Fonts included',
        sharedTables: 'Shared data items',
        totalTables: 'Total data items',
        uniqueTables: 'Unique data items',
        download: 'Download',
      },
      preview: {
        title: 'Preview',
        placeholder: 'Type here to see what the font looks like… 0123456789 ABCabc',
        sizeLabel: 'Size',
        loading: 'Preparing preview…',
        unsupported: 'This format cannot be previewed in a browser. Please download it to view.',
      },
    },
    ad: {
      label: 'Sponsored',
    },
    breadcrumb: {
      home: 'Home',
    },
    footer: {
      localOnly: 'Everything runs in your browser. Your font files never upload.',
      copyright: 'Powered by fntx',
      groups: {
        tools: 'Tools',
        learn: 'Learn',
        about: 'About',
      },
      links: {
        home: 'Font workbench',
        subset: 'Shrink fonts',
        convert: 'Convert formats',
        ttc: 'Font collections',
        formats: 'Font format comparison',
        guide: 'Guide & FAQ',
        glossary: 'Font glossary',
        about: 'About',
        privacy: 'Privacy',
      },
    },
  },
};
