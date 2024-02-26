import "./sidebar.css";
import logo from "./bus-solid.svg";
interface Props {
    toggleLayerVisibility: (layerName: string) => void;
    layerVisibility: Record<string, boolean>;
}
function SideBar({ toggleLayerVisibility, layerVisibility }: Props) {
    function toggleStyle(
        layerVisibility: Record<string, boolean>,
        line: string
    ) {
        if (layerVisibility[line]) {
            return "toggle-button active";
        } else {
            return "toggle-button";
        }
    }

    return (
        <aside className="sidebar">
            <div className="top">
                <h1>HSL Pysäkit</h1>
                <div>
                    <img src={logo} alt="buss-icon" />
                </div>
            </div>
            <ul>
                {Object.keys(layerVisibility).map((line) => {
                    return (
                        <li key={line}>
                            <button
                                className={toggleStyle(layerVisibility, line)}
                                onClick={() => toggleLayerVisibility(line)}
                            >
                                <p>{`Verkosto ${line.charAt(4)}`}</p>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

export default SideBar;
