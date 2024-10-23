import express from "express";
import cors from "cors";
import ConnectDB from "./src/config/db.js";
import dotenv from 'dotenv';
import { cwd } from 'process';
import { frontendRoutes } from './src/routes/frontend/frontendRouters/frontendRoute.js';
import { dashboardRoutes } from "./src/routes/dashboard/dashboardRoutes/DashboardRoute.js";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use('/uploads', express.static(cwd() + '/uploads',{ maxAge:31557600 }));

const port = process.env.PORT;

app.use('/api/dashboard',dashboardRoutes);

app.use('/api/frontend',frontendRoutes);

ConnectDB();

app.listen(port, () => {
  console.log(`server listening number - ${port}`);
});
