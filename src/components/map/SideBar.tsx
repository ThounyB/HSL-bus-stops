import VectorLayer from "ol/layer/Vector";
import "./sidebar.css";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import icon from "../../assets/bus-solid.svg";

interface Props {
    toggleLayers: (
        layer: VectorLayer<VectorSource<Feature<Geometry>>>[]
    ) => void;
    layers: VectorLayer<VectorSource<Feature<Geometry>>>[] | null;
}
function SideBar({ toggleLayers, layers }: Props) {
    if (!layers) {
        return;
    }
    return (
        <aside className="sidebar">
            <ul>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layers)}
                    >
                        <img src={icon}></img>
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layers)}
                    >
                        <img src={icon}></img>0
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layers)}
                    >
                        <img src={icon}></img>1
                    </button>
                </li>

                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layers)}
                    >
                        <img src={icon}></img>2
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layers)}
                    >
                        <img src={icon}></img>3
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayers(layers)}
                    >
                        <img src={icon}></img>4
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
