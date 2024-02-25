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
// import Select from "ol/interaction/Select";
import { useGeographic } from "ol/proj";
import SideBar from "./SideBar";
import { Overlay } from "ol";

function OLMap() {
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = useRef(null);
    // const [selectedLayer, setSelectedLayer] = useState();

    const [layers, setLayers] = useState<
        VectorLayer<VectorSource<Feature<Geometry>>>[] | null
    >(null);

    useGeographic();

    function toggleLayers(
        layers: VectorLayer<VectorSource<Feature<Geometry>>>[]
    ) {
        layers.forEach((layer) => {
            layer.setVisible(!layer.getVisible());
        });
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

        console.log();

        const verkko0Feature = features.filter((feature) => {
            return feature.get("VERKKO") === 0;
        });

        // const verkko1Feature = features.filter((feature) => {
        //     return feature.get("VERKKO") === 1;
        // });

        const vectorSourceVerkko0 = new VectorSource({
            features: verkko0Feature,
        });

        const vectorLayerVerkko0 = new VectorLayer({
            source: vectorSourceVerkko0 as VectorSource<Feature<Geometry>>,
            visible: true,
        });

        setLayers([vectorLayerVerkko0]);

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayerVerkko0,
            ],
            view: new View({
                center: [24.87413567501612, 60.19903248030195],
                zoom: 14,
            }),
        });

        const overlay = new Overlay({
            element: document.createElement("div"),
            positioning: "bottom-center",
            offset: [0, -10], // Offset to adjust the position of the overlay
            autoPan: true,
        });

        map.addOverlay(overlay);

        // const select = new Select();

        // map.addInteraction(select);

        // Event listener for when a feature is selected
        // select.on("select", (event) => {
        //     const selectedFeature = event.selected[0];
        //     if (selectedFeature) {
        //         const info = selectedFeature.get("NIMI1");
        //         overlay.setPosition(event.mapBrowserEvent.coordinate);

        //         const overlayElement = overlay.getElement();

        //         if (!overlayElement) {
        //             return;
        //         }
        //         overlayElement.classList.add("bus-stop-overlay");
        //         overlayElement.innerHTML = info;
        //     } else {
        //         overlay.setPosition(undefined);
        //     }
        // });

        function handleFeatureHover(e) {
            const pixel = e.pixel;
            const feature = map.forEachFeatureAtPixel(
                pixel,
                (feature) => feature
            );
            if (feature) {
                const info = feature.get("NIMI1");
                const element = overlay.getElement();
                if (!element) {
                    return;
                }
                element.innerHTML = info;
                element.classList.add("bus-stop-overlay");
                overlay.setPosition(map.getCoordinateFromPixel(pixel));
            } else {
                overlay.setPosition(undefined);
            }
        }

        map.on("pointermove", handleFeatureHover);

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
        <div>
            <div ref={mapRef} id="map" />
            <SideBar toggleLayers={toggleLayers} layers={layers} />
        </div>
    );
}

export default OLMap;
