import * as XLSX from "xlsx";
import { useActions } from "../context/ActionsContext";

export default function ImportExportButtons() {
  const { actions, importActions } = useActions();

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(actions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Acciones");
    XLSX.writeFile(wb, "acciones.xlsx");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(sheet);
      importActions(imported);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={handleExport}>Exportar a Excel</button>
      <label style={{ marginLeft: "10px" }}>
        Importar Excel
        <input type="file" accept=".xlsx" onChange={handleImport} style={{ display: "none" }} />
      </label>
    </div>
  );
}
