const functions = require("firebase-functions");
const { api } = require("./main");
const admin = require("firebase-admin");
const { MeiliSearch } = require("meilisearch");

var serviceAccount = require("./account");
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const client = new MeiliSearch({
  host: "yourhost",
  apiKey: "yourkey",
});

exports.api = functions.https.onRequest(api);

exports.addMovieToMelliSearch = functions.firestore
  .document("movies/{movieId}")
  .onCreate(async (snap) => {
    const index = "movies";

    const data = snap.data();

    await client.index(index).addDocuments([data]);
  });

exports.updateMovieMelliSearch = functions.firestore
  .document("movies/{movieId}")
  .onUpdate(async (change) => {
    const newValue = change.after.data();

    const index = "movies";

    await client.index(index).updateDocuments([newValue]);
  });

exports.deleteMovieMelliSearch = functions.firestore
  .document("movies/{movieId}")
  .onDelete(async (snap) => {
    const deletedValue = snap.data();

    await client.index(index).deleteDocument(deletedValue.movieId);

    // Or that particular data point's id.
  });
