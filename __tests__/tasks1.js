const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'))
    await page.setViewport({ width: 1080, height: 500 });
});

afterAll(async () => {
    await browser.close()
});



describe("Layout", () => {
    test("Three flex containers are present", async () => {
        // get the number of flex containers
        const flexContainers = await page.evaluate(() => {
            const flexContainers = Array.from(document.querySelectorAll("*")).filter(el => window.getComputedStyle(el).display === "flex");
            return flexContainers.length;
        });
        expect(flexContainers).toBeGreaterThan(2);
    });
    test("Thumbnails are arranged in 3 columns", async () => {
        // get all thumbnails images
        const thumbnails = await page.evaluate(() => {
            const thumbnails = Array.from(document.querySelectorAll('img')).filter(img => img.src.includes('thumbnail'));
            // return position top and left of each thumbnail
            return thumbnails.map(thumbnail => {
                const { top, left } = thumbnail.getBoundingClientRect();
                return { top, left };
            });
        });
        expect(thumbnails[0].top).toBe(thumbnails[1].top);
        expect(thumbnails[1].top).toBe(thumbnails[2].top);
        expect(thumbnails[0].top).toBeLessThan(thumbnails[5].top);
    })
    test("Sidebar with menu items is present", async () => {
        // get the a elements contains "Action" text in black color
        const sidebarElm = await page.evaluate(() => {
            const sidebarAction = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.toLowerCase() === "action" && window.getComputedStyle(a).color === "rgb(0, 0, 0)");
            const sidebarComedy = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.toLowerCase() === "comedy" && window.getComputedStyle(a).color === "rgb(0, 0, 0)");
            // return position x of each sidebar element
            return { action: sidebarAction[0].getBoundingClientRect().x, comedy: sidebarComedy[0].getBoundingClientRect().x };
        });
        expect(sidebarElm.action).toBe(sidebarElm.comedy);
    });
});
describe("Colors", () => {
    test("background of logo should be `#000` ", async () => {
        // get the element that has a black background
        const logo = await page.evaluate(() => {
            const logo = Array.from(document.querySelectorAll("*")).filter(el => window.getComputedStyle(el).backgroundColor === "rgb(0, 0, 0)");
            return logo[0].getBoundingClientRect();
        });
        expect(logo).toBeTruthy();
    })
    test("background of thumbnail should be `#1a1a1a` ", async () => {
        // get the element that has a #1a1a1a background
        const thumbnail = await page.evaluate(() => {
            const thumbnail = Array.from(document.querySelectorAll("*")).filter(el => window.getComputedStyle(el).backgroundColor === "rgb(26, 26, 26)");
            return thumbnail;
        });
        expect(thumbnail.length).toBeTruthy();

    })
    test("background of thumbnail container should be `#4b4b4b` ", async () => {
        // get the element that has a #4b4b4b background
        const thumbnailContainer = await page.evaluate(() => {
            const thumbnailContainer = Array.from(document.querySelectorAll("*")).filter(el => window.getComputedStyle(el).backgroundColor === "rgb(75, 75, 75)");
            return thumbnailContainer;
        });
        expect(thumbnailContainer.length).toBeTruthy();
    })
})

