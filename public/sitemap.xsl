<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sun Pyramids Tours Sitemap</title>
        <meta name="robots" content="noindex,follow" />
        <style>
          body{font-family:system-ui,sans-serif;margin:0;background:#f7f8fb;color:#172033}
          main{max-width:1100px;margin:3rem auto;padding:0 1rem}
          h1{color:#143485}table{width:100%;border-collapse:collapse;background:white}
          th,td{padding:.75rem;text-align:left;border-bottom:1px solid #e4e7ee;vertical-align:top}
          th{background:#143485;color:white}a{color:#143485;word-break:break-all}
          .muted{color:#657089;font-size:.9rem}
        </style>
      </head>
      <body>
        <main>
          <h1>Sun Pyramids Tours Sitemap</h1>
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <p class="muted"><xsl:value-of select="count(s:sitemapindex/s:sitemap)" /> child sitemaps</p>
              <table><thead><tr><th>Sitemap</th><th>Last modified</th></tr></thead><tbody>
                <xsl:for-each select="s:sitemapindex/s:sitemap">
                  <tr><td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td><td><xsl:value-of select="s:lastmod" /></td></tr>
                </xsl:for-each>
              </tbody></table>
            </xsl:when>
            <xsl:otherwise>
              <p class="muted"><xsl:value-of select="count(s:urlset/s:url)" /> canonical records</p>
              <table><thead><tr><th>URL</th><th>Last modified</th><th>Alternates</th><th>Images</th></tr></thead><tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                    <td><xsl:value-of select="s:lastmod" /></td>
                    <td><xsl:value-of select="count(xhtml:link)" /></td>
                    <td><xsl:value-of select="count(image:image)" /></td>
                  </tr>
                </xsl:for-each>
              </tbody></table>
            </xsl:otherwise>
          </xsl:choose>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
