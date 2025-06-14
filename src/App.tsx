import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MonthSelector from "./pages/MonthSelector";
import CurrentMonthTable from "./pages/CurrentMonthTable";
import Summary from "./pages/Summary";
import EditItems from "./pages/EditItems";
import Visualization from "./pages/Visualization";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/month" element={<MonthSelector />} />
      <Route path="/current" element={<CurrentMonthTable />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/edit" element={<EditItems />} />
      <Route path="/visualization" element={<Visualization />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
