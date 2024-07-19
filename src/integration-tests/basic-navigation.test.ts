import portfinder from 'portfinder';
import puppeteer from 'puppeteer';
import { Server } from 'http';
import { app } from '../index'; // Импортируем сервер

let server: Server | null = null;
let port: number | null = null;

beforeEach(async () => {
    port = await portfinder.getPortPromise();
    server = app.listen(port);
});

afterEach(() => {
    if (server) {
        server.close();
    }
});

test('home page links to about page', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);
    await Promise.all([
        page.waitForNavigation(),
        page.click('[data-test-id="filestorage"]'),
    ]);
    expect(page.url()).toBe(`http://localhost:${port}/filestorage`);
    await browser.close();
});
