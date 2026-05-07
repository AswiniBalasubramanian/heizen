import { Navigate, Route, Routes } from "react-router-dom";
import ScreenRequisitionsList from "./screens/ScreenRequisitionsList";
import Screen1Type from "./screens/Screen1Type";
import Screen2Details from "./screens/Screen2Details";
import Screen3Schedule from "./screens/Screen3Schedule";
import Screen4Compensation from "./screens/Screen4Compensation";
import Screen5Compliance from "./screens/Screen5Compliance";
import ScreenDone from "./screens/ScreenDone";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/requisitions/templates" replace />} />
      <Route path="/requisitions/templates" element={<ScreenRequisitionsList />} />
      <Route path="/requisitions/templates/new/type" element={<Screen1Type />} />
      <Route path="/requisitions/templates/new/details" element={<Screen2Details />} />
      <Route path="/requisitions/templates/new/schedule" element={<Screen3Schedule />} />
      <Route
        path="/requisitions/templates/new/compensation"
        element={<Screen4Compensation />}
      />
      <Route
        path="/requisitions/templates/new/compliance"
        element={<Screen5Compliance />}
      />
      <Route path="/requisitions/templates/new/done" element={<ScreenDone />} />
      <Route path="*" element={<Navigate to="/requisitions/templates" replace />} />
    </Routes>
  );
}
