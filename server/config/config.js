//====================
// PORT
//====================

process.env.PORT = process.env.PORT || 3000;

//====================
// ENVIORNMENT
//====================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//====================
//TOKEN EXPIRATION DATE
//====================
process.env.EXPIRATION_TOKEN = '48h';

//====================
// ENVIORNMENT
//====================
process.env.SEED = process.env.EXPIRATION_SEED || "token-seed";

//====================
// DATABASE
//====================
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;
//====================
// GOOGLE CLIENT ID
//====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '928259373677-kf55fk2ov387u2j8ag3jvbeb6krtevol.apps.googleusercontent.com';