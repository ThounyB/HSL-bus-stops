import OLMap from "./OLMap";
import SideBar from "./SideBar";

function MapView() {
    return (
        <div className="map-view">
            <OLMap />
            <SideBar />
        </div>
    );
}

export default MapView;
