import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "./olMap.css";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import MapBrowserEvent from "ol/MapBrowserEvent";
import { useGeographic } from "ol/proj";
import SideBar from "./SideBar";

function OLMap() {
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = useRef(null);

    const [layer, setLayer] = useState<VectorLayer<
        VectorSource<Feature<Geometry>>
    > | null>(null);

    useGeographic();

    function toggleLayers(layer: VectorLayer<VectorSource<Feature<Geometry>>>) {
        layer.setVisible(!layer.getVisible());
    }

    useEffect(() => {
        const fetchGeoJson = async () => {
            try {
                const response = await fetch("src/assets/stops.geojson");
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch GeoJSON (${response.status} ${response.statusText})`
                    );
                }
                const data = await response.json();
                setGeojsonData(data);
            } catch (error) {
                console.error("Error fetching GeoJSON:", error);
                throw error;
            }
        };

        fetchGeoJson();
    }, []);

    useEffect(() => {
        if (!mapRef.current || !geojsonData) return;

        const features = new GeoJSON().readFeatures(geojsonData);

        const vectorSource = new VectorSource({
            features: features,
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource as VectorSource<Feature<Geometry>>,
            visible: true,
        });

        setLayer(vectorLayer);

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
            ],
            view: new View({
                center: [24.87413567501612, 60.19903248030195],
                zoom: 14,
            }),
        });

        function coords(e: MapBrowserEvent<PointerEvent>) {
            const view = map.getView();
            const center = view.getCenter();
            const zoom = view.getZoom();
            console.log("View Center:", center);
            console.log("Zoom Level:", zoom);

            console.log("click coords ", e.coordinate);
        }

        map.on("click", (e) => coords(e));

        return () => {
            map.dispose();
        };
    }, [geojsonData]);

    return (
        <div className="map-view">
            <div ref={mapRef} id="map" />
            <SideBar toggleLayers={toggleLayers} layer={layer} />
        </div>
    );
}

export default OLMap;
