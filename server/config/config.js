//====================
// PORT
//====================

process.env.PORT = process.env.PORT || 3000;

//====================
// ENVIORNMENT
//====================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//====================
// DATABASE
//====================
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = "mongodb+srv://bryanh24:Comun123*@cluster0.s504h.mongodb.net/cafe";
}
process.env.URLDB = urlDB;