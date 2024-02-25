import "./sidebar.css";

interface Props {
    toggleLayer: (line: string) => void;
    layerVisibility?: boolean;
}
function SideBar({ toggleLayer }: Props) {
    const handleLayerToggle = (line: string) => {
        // Call the function from OLMap to toggle layer visibility
        toggleLayer(line);
    };
    return (
        <aside className="sidebar">
            <ul>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => handleLayerToggle("line2")}
                    >
                        {/* <img src={icon}></img> */}2
                    </button>
                </li>
                <li>
                    <button
                        className="toggle-button"
                        onClick={() => handleLayerToggle("line3")}
                    >
                        3
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
