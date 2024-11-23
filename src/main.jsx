import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TodoContextProvider } from "./context/TodoContext.jsx";

export const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <TodoContextProvider>
        <App />
      </TodoContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
