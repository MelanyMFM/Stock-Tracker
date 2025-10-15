import "./dashboard.css";
import { reconocerImagen } from "../../services/recImagen";

export function Dashboard() {

reconocerImagen()
    .then((result) => {
        console.log("Image recognition result:", result);
    })
    .catch((error) => {
        console.error("Error recognizing image:", error);
    });

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your stock tracker dashboard.</p>
        </div>
    );
};
