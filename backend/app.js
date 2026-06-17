const express = require("express")
const cors = require("cors")


const userRoutes =
require("./routes/userRoutes")


const app = express()



app.use(
cors({
origin:process.env.CLIENT_URL
})
)


app.use(
express.json()
)



app.get(
"/",
(req,res)=>{
res.json({
message:"GhostNote API Running"
})
}
)



app.use(
"/api/users",
userRoutes
)



module.exports = app