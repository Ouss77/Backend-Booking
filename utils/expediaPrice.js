
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

let scrapeExpedia = async (hotel_name, city, check_in, check_out) => {
  console.time("scrapeExpedia");
  //console.log("the city is >>>>>>>>>>>>>>>>>>", city);
  const browser = await puppeteer.launch({
    headless: true,
    //userDataDir: '/scrape',
    defaultViewport: null,
    //args: ["--blink-settings=imagesEnabled=false"],
  });
  const page = await browser.newPage();
  await page.setDefaultTimeout(120000); // Set timeout to 1 minute

  // await page.goto(
  //   `https://euro.expedia.net/Hotel-Search?adults=2&children=${check_in}&d2=${check_out}&destination=Marrakech%2C%20Marrakech%2C%20Marrakech-Safi%2C%20Morocco&endDate=${check_out}&latLong=&mapBounds=&pwaDialog&regionId=2938&rooms=1&semdtl=&sort=RECOMMENDED&startDate=${check_in}&theme=&useRewards=false&userIntent=`
  // );
  await page.goto('https://www.expedia.com/Hotel-Search?rooms=1&adults=2&destination=ibis+fes&startDate=2023-05-12&endDate=2023-05-13&d1=2023-05-12&d2=2023-05-13')
  await page.click(".uitk-fake-input");
  await page.waitForTimeout(2000);
  //console.log("the hotel name is ", hotel_name);
  //await page.keyboard.type(`${hotel_name} ${city}`);
  await page.keyboard.type("Ibis Fes")
      //await page.keyboard.type("Ibis Hotel fes");
  await page.waitForTimeout(2000);

  //await page.click(".location-field-destination-result-item-button");
  await page.click('[data-stid="destination_form_field-result-item-button"]');

  //await page.click('[data-testid="submit-button"]');
  //await page.waitForNavigation();

  await page.waitForTimeout(8000);
  const result = await page.evaluate(() => {
    const element = document.querySelector(
      ".uitk-text.uitk-type-end.uitk-type-300.uitk-type-medium.uitk-text-negative-theme"
    );
    if (!element) {
      const price = document.querySelectorAll(".uitk-text.uitk-type-600")[0]
        .innerText;
      console.log(price);
      return { price };
    } else {
      return "Sold Out";
    }
  });
  browser.close();
  console.timeEnd("scrapeExpedia");
console.log(result);
  return result;
};

module.exports.scrapeExpedia = scrapeExpedia;
