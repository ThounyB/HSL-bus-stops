import "./sidebar.css";
// import logo from "./bus-solid.svg";
interface Props {
    toggleLayerVisibility: (layerName: string) => void;
}
function SideBar({ toggleLayerVisibility }: Props) {
    return (
        <aside className="sidebar">
            <ul>
                <li>{/* <img src={logo} alt="" /> */}</li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line0")}
                    >
                        Verkko 0
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line1")}
                    >
                        Verkko 1
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line2")}
                    >
                        Verkko 2
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line3")}
                    >
                        Verkko 3
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line4")}
                    >
                        Verkko 4
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
