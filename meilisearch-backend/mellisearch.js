const express = require("express");
const cors = require("cors")({ origin: true });

const { MeiliSearch } = require("meilisearch");

const mellisearch = express();

mellisearch.use(cors);

const client = new MeiliSearch({
  host: "yourhost",
  apiKey: "yourkey",
});

mellisearch.get("/test", async (req, res) => {
  res.send({ message: "ok" });
});

mellisearch.post("/create-index", async (req, res) => {
  const index = req.body.index;
  const primaryKey = req.body.primaryKey;

  await client.createIndex(index, { primaryKey: primaryKey });

  res.send({ message: "ok" });
});

mellisearch.post("/add-document", async (req, res) => {
  const index = req.body.index;

  const data = req.body.data;

  client
    .index(index)
    .getRawInfo()
    .then(async () => {
      await client.index(index).addDocuments([data]);
    })
    .catch(async (e) => {
      await client.createIndex(index, { primaryKey: "movieId" });

      await client.index(index).addDocuments([data]);
    });

  res.send({ message: "ok" });
});

mellisearch.post("/update-document", async (req, res) => {
  const index = req.body.index;

  const data = req.body.data;

  await client.index(index).updateDocuments([data]);

  res.send({ message: "updated" });
});

mellisearch.post("/delete-document", async (req, res) => {
  const index = req.body.index;
  const id = req.body.id;

  await client.index(index).deleteDocument(id);

  res.send({ message: "ok" });
});

mellisearch.post("/delete-index", async (req, res) => {
  const index = req.body.index;

  await client.deleteIndexIfExists(index);

  res.send({ message: "ok" });
});

mellisearch.post("/delete-documents", async (req, res) => {
  const index = req.body.index;

  await client.index(index).deleteAllDocuments();

  res.send({ message: "ok" });
});

mellisearch.post("/search", async (req, res) => {
  try {
    const index = req.body.index;
    const search = req.body.search;

    if (search?.length > 0) {
      const response = await client.index(index).search(search, {
        limit: 7,
        showRankingScore: true,
      });

      res.send({ hits: response.hits });
    } else {
      res.send({ hits: [] });
    }
  } catch (error) {
    res.send({ error: error });
  }
});

module.exports = {
  mellisearch,
};
