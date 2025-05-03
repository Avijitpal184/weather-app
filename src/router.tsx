import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import WeatherDashboard from "./pages/WeatherDashboard";
import CityPage from "./pages/CityPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <WeatherDashboard />,
      },
      {
        path: "/city/:cityName",
        element: <CityPage />,
      },
    ],
  },
]);
