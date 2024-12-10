import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import Dashboard from "./Dashboard";
import AllCollections from "./AllCollections";
import AllDatafeeds from "./AllDatafeeds";
import AllDatasets from "./AllDatasets";
import AllDetectors from "./AllDetectors";
import AllAnomalies from "./AllAnomalies";
import AllPredictions from "./AllPredictions";
import AllHealth from "./AllHealth";
import Collection from "./Collection";
import Datafeed from "./Datafeed";
import Dataset from "./Dataset";
import Detector from "./Detector";
import Prediction from "./Prediction";
import Health from "./Health";
import Layout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthProvider } from "./auth/hooks/AuthProvider";

// Create a client
const queryClient = new QueryClient();

function MainApp() {
  const { AuthProvider } = useAuthProvider();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="Dashboard" element={<Dashboard />} />
              <Route path="AllCollections" element={<AllCollections />} />
              <Route path="AllDatafeeds" element={<AllDatafeeds />} />
              <Route path="AllDatasets" element={<AllDatasets />} />
              <Route path="AllDetectors" element={<AllDetectors />} />
              <Route path="AllAnomalies" element={<AllAnomalies />} />
              <Route path="AllPredictions" element={<AllPredictions />} />
              <Route path="AllHealth" element={<AllHealth />} />
              <Route path="Collection" element={<Collection />} />
              <Route path="Datafeed" element={<Datafeed />} />
              <Route path="Detector" element={<Detector />} />
              <Route path="Dataset" element={<Dataset />} />
              <Route path="Prediction" element={<Prediction />} />
              <Route path="Health" element={<Health />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
