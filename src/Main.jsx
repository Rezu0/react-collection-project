import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import StylingBody from "./styles/StylingBody";
import { CssBaseline } from "@mui/joy";

import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById('root'))
root.render(
  <>
    <CssBaseline />
    <StylingBody />
    <App />
  </>
)