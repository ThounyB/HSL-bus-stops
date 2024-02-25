import VectorLayer from "ol/layer/Vector";
import "./sidebar.css";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import icon from "../bus-solid.svg";

interface Props {
    toggleLayers: (layer: VectorLayer<VectorSource<Feature<Geometry>>>) => void;
    layer: VectorLayer<VectorSource<Feature<Geometry>>> | null;
}
function SideBar({ toggleLayers, layer }: Props) {
    if (!layer) {
        return;
    }
    return (
        <aside className="sidebar">
            <ul>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layer)}
                    >
                        <img src={icon}></img>
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
