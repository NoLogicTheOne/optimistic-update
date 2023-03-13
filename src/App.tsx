import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { TargetTemperature } from "./examples/TargetTemperature/TargetTemperature";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TargetTemperature />
    </QueryClientProvider>
  );
}

export default App;
