const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const cors = require("cors")
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
require("./db")

const AuthRoutes = require("./Routes/AuthRoutes") 
app.use("/api", AuthRoutes)
 
const OtpRouter = require("./Routes/OtpRoutes")
app.use("/api", OtpRouter)

const ProductRouter = require("./Routes/ProductRoutes")
app.use("/api", ProductRouter)

const CartRouter = require("./Routes/CartRoutes")
app.use("/api", CartRouter)

const PurchaseRoutes = require("./Routes/PurchasesRoutes")
app.use("/api", PurchaseRoutes)

const warrantyRoutes = require("./Routes/WarrantyRoutes")
app.use("/api", warrantyRoutes)

const qrRoutes = require("./Routes/QrRoutes")
app.use("/api", qrRoutes)

const port = process.env.PORT || 3000


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

