const nock = require('nock');
const SitemapScraper = require('../sitemap-scraper');

describe('SitemapScraper', () => {

  let spy = {};

  beforeAll(() => {
    nock.disableNetConnect();
    // We want this to get it to shutup so console logging messages in our
    // code do not appear on the console.
    spy.consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    // We need this to check that we are logging an error in some tests.
    spy.consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterAll(() => {
		nock.cleanAll();
    nock.enableNetConnect();
    spy.consoleLog.mockRestore();
    spy.consoleError.mockRestore();
  });
  
  const scraper = new SitemapScraper();

  test('Loads and parses small sitemap', async () => {
    const scope = nock('https://example.org')
      .get('/sitemap.xml')
        .reply(200, `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<!--Generated by the Simple XML Sitemap Drupal module: https://drupal.org/project/simple_sitemap.-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
 <url>
  <loc>https://example.org/test-web-page</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.org/test-web-page/"/>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
 </url>
 <url>
  <loc>https://example.org/some-file.pdf</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.org/some-file.pdf"/>
  <lastmod>2019-06-29T10:09:46-04:00</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.5</priority>
 </url>
</urlset>
      `);

    const expected = [
      'https://example.org/test-web-page',
      'https://example.org/some-file.pdf'
    ];
    const actual = await scraper.fetch('https://example.org/sitemap.xml');
    expect(actual).toEqual(expected);
    // TODO: Test fetching notice
    scope.done();
  });

  // TODO: Test error sitemap index.
  // TODO: Test error cases.

})