<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>RSS 订阅 — 盘腿修仙</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: "Noto Serif SC", Georgia, serif; background: #f7f3ee; color: #2c2c2c; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .container { max-width: 520px; padding: 3rem 2rem; text-align: center; }
          .icon { width: 64px; height: 64px; margin: 0 auto 1.5rem; background: #d4a574; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
          .icon svg { width: 32px; height: 32px; fill: #f7f3ee; }
          h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
          p { color: #666; line-height: 1.8; margin-bottom: 1.5rem; font-size: 0.95rem; }
          .feed-url { display: inline-block; background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 0.75rem 1.25rem; font-family: "JetBrains Mono", monospace; font-size: 0.85rem; color: #d4a574; word-break: break-all; user-select: all; margin-bottom: 1.5rem; }
          .hint { font-size: 0.8rem; color: #999; line-height: 1.6; }
          .hint a { color: #d4a574; text-decoration: none; }
          .hint a:hover { text-decoration: underline; }
          @media (prefers-color-scheme: dark) { body { background: #1a1a1e; color: #e8e0d8; } .feed-url { background: #2a2a2e; border-color: #444; color: #d4a574; } p { color: #aaa; } .hint { color: #777; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">
            <svg viewBox="0 0 24 24"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>
          </div>
          <h1>盘腿修仙 RSS</h1>
          <p>将下方地址复制到你的 RSS 阅读器中，即可订阅博客更新。</p>
          <div class="feed-url">https://zilvd.icu/rss.xml</div>
          <p class="hint">
            推荐阅读器：<a href="https://feedly.com">Feedly</a> · <a href="https://www.inoreader.com">Inoreader</a> · <a href="https://miniflux.app">Miniflux</a><br/>
            或使用浏览器插件如 Feedbro、RSS Reader
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
