const express = require("express");
const cors = require("cors");
const app = express();
const scrapeWhatsApp = require("./whatsapp-scraper");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

// Define a porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// ** Rota para obter os dados do grupo a partir do front-end **
// app.get("/group", async (req, res) => {
//   const groupName = req.query.name;

//   console.log("groupName", groupName, req.query);

//   try {
//     const df = await scrapeWhatsApp(groupName);
//     res.send(df);
//   } catch (error) {
//     console.error("Erro ao realizar o scraping:", error);
//     res.status(500).send("Erro ao realizar o scraping");
//   }
// });

// ** Rota para obter os dados do grupo apenas do back-end, caso contrário, comentar esta linha  **
(async () => {
  try {
    //Substitua pelo nome do grupo desejado
    const groupName = "Tropa do vôlei 🔥";
    const df = await scrapeWhatsApp(groupName);

    //Aqui você pode manipular o dataframe ou enviá-lo para o banco de dados
    console.log("Dados extraídos com sucesso!");
    console.log(df);
  } catch (error) {
    console.error("Erro ao realizar o scraping:", error);
  }
})();
