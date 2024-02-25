import "./sidebar.css";
interface Props {
    toggleLayerVisibility: (layerName: string) => void;
}
function SideBar({ toggleLayerVisibility }: Props) {
    return (
        <aside className="sidebar">
            <ul>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line2")}
                    >
                        {/* <img src={icon}></img> */}2
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => toggleLayerVisibility("line3")}
                    >
                        3
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
