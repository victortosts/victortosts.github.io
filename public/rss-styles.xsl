<?xml version="1.0" encoding="UTF-8"?>
<!--
  Browsers stopped rendering RSS years ago, so a feed URL hands a visitor raw
  XML. This stylesheet is applied by the browser only: feed readers ignore the
  xml-stylesheet instruction entirely and parse the RSS underneath as usual.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="/rss/channel/title" /> — feed</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&amp;display=swap"
        />
        <style>
          :root {
            --bg: #0f1419;
            --bg2: #171d24;
            --border: #2a333d;
            --text: #cbd5e1;
            --dim: #8b98a8;
            --faint: #78838f;
            --amber: #e0a458;
            --teal: #5ec6b0;
            --link: #6fb3e0;
            color-scheme: dark;
          }

          @media (prefers-color-scheme: light) {
            :root {
              --bg: #fbfaf7;
              --bg2: #f2efe9;
              --border: #d8d2c6;
              --text: #24292f;
              --dim: #5c6672;
              --faint: #68727e;
              --amber: #9a6212;
              --teal: #0f7a6a;
              --link: #1a6fb5;
              color-scheme: light;
            }
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.875rem;
            line-height: 1.75;
            background: var(--bg);
            color: var(--text);
            padding: 3rem 1.5rem 4rem;
          }

          .wrap { max-width: 46rem; margin-inline: auto; }

          a { color: var(--link); text-decoration: none; border-bottom: 1px solid transparent; }
          a:hover { border-bottom-color: currentColor; }

          .ps1 { color: var(--amber); }

          h1 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 0.75rem;
          }

          h1 .hash { color: var(--faint); }

          .tagline { color: var(--dim); font-size: 0.8rem; margin-top: 0.3rem; }

          .note {
            border: 1px solid var(--border);
            border-radius: 4px;
            background: var(--bg2);
            padding: 0.9rem 1rem;
            margin: 2rem 0;
            font-size: 0.8rem;
            color: var(--dim);
          }

          .note strong { color: var(--text); font-weight: 500; }

          .url {
            display: block;
            margin-top: 0.6rem;
            padding: 0.5rem 0.7rem;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 3px;
            color: var(--teal);
            font-size: 0.78rem;
            overflow-wrap: anywhere;
          }

          .items { list-style: none; display: flex; flex-direction: column; gap: 1.5rem; }

          .item-title { font-size: 0.9rem; font-weight: 500; }

          .item-date { color: var(--faint); font-size: 0.72rem; }

          .item-desc { color: var(--dim); font-size: 0.8rem; margin-top: 0.2rem; }

          .back { margin-top: 3rem; font-size: 0.75rem; }
          .back a { color: var(--dim); }

          hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
        </style>
      </head>

      <body>
        <div class="wrap">
          <div class="ps1">victor@portfolio:~$ curl -s ~/rss.xml</div>

          <h1>
            <span class="hash">#</span><xsl:value-of select="/rss/channel/title" />
          </h1>
          <p class="tagline"><xsl:value-of select="/rss/channel/description" /></p>

          <div class="note">
            <strong>This is an RSS feed.</strong> It is meant for a feed reader, not a
            browser — subscribe once and every new post arrives automatically, with no
            email address and no account. Paste this URL into Feedly, Inoreader,
            NetNewsWire, or whatever you already use:
            <code class="url"><xsl:value-of select="/rss/channel/link" />rss.xml</code>
          </div>

          <hr />

          <ul class="items">
            <xsl:for-each select="/rss/channel/item">
              <li>
                <div class="item-date">
                  <xsl:value-of select="substring(pubDate, 6, 11)" />
                </div>
                <div class="item-title">
                  <a href="{link}"><xsl:value-of select="title" /></a>
                </div>
                <div class="item-desc"><xsl:value-of select="description" /></div>
              </li>
            </xsl:for-each>
          </ul>

          <p class="back">
            <a href="{/rss/channel/link}">← <xsl:value-of select="/rss/channel/link" /></a>
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
