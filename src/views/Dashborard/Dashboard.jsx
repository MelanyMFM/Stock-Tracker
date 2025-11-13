import AddActionsModal from "../../components/AddActionsModal";
import ActionsTable from "../../components/ActionsTable";
import ImportExportButtons from "../../components/ImportExportButtons";

export function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <AddActionsModal />
      <ImportExportButtons />
      <ActionsTable />
    </div>
  );
}
