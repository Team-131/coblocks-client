import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./app/App";
import store from "./app/configureStore";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
