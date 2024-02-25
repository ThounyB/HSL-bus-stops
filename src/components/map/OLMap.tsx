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
import { useGeographic } from "ol/proj";
import SideBar from "./SideBar";

interface LayerVisibility {
    [key: string]: boolean;
}

function OLMap() {
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = useRef(null);
    const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
        line0: false,
        line1: false,
        line2: false,
        line3: false,
        line4: false,
    });

    const [layerMap, setLayerMap] = useState<Record<
        string,
        VectorLayer<VectorSource<Feature<Geometry>>>
    > | null>(null);

    useGeographic();

    function toggleLayerVisibility(layerName: string) {
        const layer = layerMap?.[layerName];

        console.log("LAyer ", layer);
        console.log("LayerName: ", layerName);

        console.log("layermap ", layerMap);

        if (layer) {
            layer.setVisible(!layer.getVisible());
            setLayerVisibility((prev) => ({
                ...prev,
                [layerName]: !prev[layerName],
            }));
        }
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

        const lines = [0, 1, 2, 3, 4];

        const features = new GeoJSON().readFeatures(geojsonData);

        const mapLayers: VectorLayer<VectorSource<Feature<Geometry>>>[] = [];

        for (const lineNumber of lines) {
            const lineFeatures = features.filter(
                (feature) => feature.get("VERKKO") === lineNumber
            );

            const vectorSource = new VectorSource({ features: lineFeatures });
            const vectorLayer = new VectorLayer({
                source: vectorSource as VectorSource<Feature<Geometry>>,
                visible: layerVisibility[`line${lineNumber}`],
            });

            mapLayers.push(vectorLayer);
        }

        const newLayerMAp = Object.fromEntries(
            mapLayers.map((layer, index) => [`line${index}`, layer])
        );

        setLayerMap(newLayerMAp);

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                ...mapLayers,
            ],
            view: new View({
                center: [24.87413567501612, 60.19903248030195],
                zoom: 10,
            }),
        });

        return () => {
            map.dispose();
        };
    }, [geojsonData]);

    return (
        <div>
            <div ref={mapRef} id="map" />
            <SideBar toggleLayerVisibility={toggleLayerVisibility} />
        </div>
    );
}

export default OLMap;
