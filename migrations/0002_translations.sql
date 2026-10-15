-- 外文项目摘要的中文译文缓存。
--
-- 背景：项目页正文是各项目自己的 README，实测 675 个有正文的快照里 616 个（91%）以
-- 英文为主。本站原有的「设备端翻译」依赖 Chrome 内置 Translator API，QQ/360/UC/
-- Firefox/Safari 都没有 —— 于是大部分目标读者（不会翻墙、也不会用浏览器翻译的人）
-- 在英文正文前束手无策。
--
-- 所以改成：读者点一下「翻译成中文」，服务端调用翻译模型生成中文摘要，结果落在这个表里。
-- 缓存键是**源文本的 sha256**，不是仓库名 —— 同一个项目在不同页面（项目页、日报卡片、
-- 历史日报）出现时文本相同，因此只需要付费翻译一次。
--
-- 存的是「摘要译文」而不是全文逐段译文：全文翻译对 675 个项目既贵又没必要，读者要的是
-- 一眼看懂这个项目做什么。

CREATE TABLE translations (
  -- 源文本的 sha256（十六进制），加上目标语言与模型，构成缓存键
  content_hash TEXT NOT NULL CHECK (length(content_hash) = 64),
  target_lang  TEXT NOT NULL CHECK (length(target_lang) BETWEEN 2 AND 16),
  -- 记下模型名：换了模型（译文质量不同）就该重新生成，而不是沿用旧译文
  model        TEXT NOT NULL CHECK (length(model) BETWEEN 1 AND 64),
  summary      TEXT NOT NULL CHECK (length(summary) BETWEEN 1 AND 2000),
  -- 便于事后核算成本与排查滥用
  input_chars  INTEGER NOT NULL DEFAULT 0,
  output_chars INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (content_hash, target_lang, model)
);

-- 用于统计用量、以及将来按时间清理（译文不会过期，但成本审计需要时间维度）
CREATE INDEX idx_translations_created_at ON translations (created_at);
