const puppeteer = require("puppeteer");
const polars = require("nodejs-polars"); // Dependência para trabalhar com dataframes

async function scrapeWhatsApp(groupName) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto("https://web.whatsapp.com");

  console.log("Por favor, faça login no WhatsApp Web.");
  await page.waitForSelector("#pane-side", { timeout: 800000 });

  await page.click(`span[title="${groupName}"]`);

  await page.waitForSelector("#main", { timeout: 60000 });

  const groupNameExtracted = await page.$eval(
    "header ._amig span",
    (el) => el.textContent
  );

  await page.click(`header span[title]`);

  await page.waitForSelector("header div[title='Dados do grupo']", {
    timeout: 30000,
  });

  const membersCount = await page.$eval(
    "section div div div:nth-of-type(3) span[aria-label]", //Seleciona o primeiro <span> na página
    (el) => el.textContent.match(/\d+/)[0] // Obtém e limpa o texto
  );

  const leftToday = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".message-in")).filter(
      (message) => {
        return (
          message.textContent.includes("saiu") &&
          message.querySelector(".message-date").textContent.includes("Hoje")
        );
      }
    ).length;
  });

  const joinedToday = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".message-out")).filter(
      (message) => {
        return (
          message.textContent.includes("adicionou") ||
          (message.textContent.includes("entrou") &&
            message.querySelector(".message-date").textContent.includes("Hoje"))
        );
      }
    ).length;
  });

  const date = new Date().toISOString();

  const dadosExtraidos = {
    grupo: [groupNameExtracted],
    membros: [membersCount],
    saidas: [leftToday],
    entradas: [joinedToday],
    data: [date],
  };

  const df = new polars.DataFrame(dadosExtraidos);
  console.log(df);

  // await browser.close();

  return df;
}

module.exports = scrapeWhatsApp;
