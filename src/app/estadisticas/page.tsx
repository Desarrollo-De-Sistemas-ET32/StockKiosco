import { ChartBarActive } from "@/components/ui/chart-bar-active";
import { ChartLineDots } from "@/components/ui/chart-line-dots";
import SemanaChart from "@/components/ui/hola";

export default function Estadisticas(){
    return(
        <main>
            <div className="size-100">
                <ChartBarActive></ChartBarActive>
            </div>
            <div className="size-100">
                <ChartLineDots></ChartLineDots>
            </div>
            <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/recharts/umd/Recharts.js"></script>
        </main>
        
    );
}