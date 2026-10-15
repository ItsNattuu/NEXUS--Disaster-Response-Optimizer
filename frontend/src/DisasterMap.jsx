import React, { useEffect, useMemo, useState } from "react";

import {

    MapContainer,

    TileLayer,

    Marker,

    Popup,

    Polyline,

    useMap,

    useMapEvents,

} from "react-leaflet";

import L from "leaflet";

import {

    MapPin,

    Plus,

    Trash2,

    Truck,

    Hospital,

    House,

    HeartPulse,

    LocateFixed,

    Search,

    LoaderCircle,

} from "lucide-react";

import "leaflet/dist/leaflet.css";

import "./DisasterMap.css";



const DEFAULT_CENTER = [22.5726, 88.3639];



const TYPES = {

    supply: { label: "Supply center", color: "#b84c76", icon: "S" },

    hospital: { label: "Hospital", color: "#8b66b0", icon: "H" },

    shelter: { label: "Shelter", color: "#3a9d7a", icon: "A" },

    affected: { label: "Affected area", color: "#dc815f", icon: "!" },

};



function markerIcon(type) {

    const config = TYPES[type] || TYPES.shelter;



    return L.divIcon({

        className: "nexus-map-marker-shell",

        html: `<div class="nexus-map-marker" style="--marker-color:${config.color}"><span>${config.icon}</span></div>`,

        iconSize: [34, 42],

        iconAnchor: [17, 38],

        popupAnchor: [0, -36],

    });

}



function TypeIcon({ type }) {

    if (type === "supply") return <Truck size={14} />;

    if (type === "hospital") return <Hospital size={14} />;

    if (type === "shelter") return <House size={14} />;

    return <HeartPulse size={14} />;

}



function MapController({ target }) {

    const map = useMap();



    useEffect(() => {

        if (target) {

            map.flyTo(target.center, target.zoom || 13, {

                duration: 1,

            });

        }

    }, [map, target]);



    return null;

}



function MapClickHandler({ enabled, onMapClick }) {

    useMapEvents({

        click(event) {

            if (enabled) onMapClick(event.latlng);

        },

    });



    return null;

}





function buildSearchQueries(input) {
    const cleaned = input
        .trim()
        .replace(/\s*,\s*/g, ", ")
        .replace(/\s+/g, " ");

    const corrected = cleaned.replace(/\bbhubhaneshwar\b/gi, "Bhubaneswar");
    const variants = [corrected];

    // Try a simpler version of long addresses if the exact address is not indexed.
    const parts = corrected.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 3) {
        variants.push(parts.slice(-3).join(", "));
    }
    if (parts.length >= 2) {
        variants.push(parts.slice(-2).join(", "));
    }

    return [...new Set(variants.filter(Boolean))].slice(0, 3);
}

const wait = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

async function geocodePlace(input) {
    const queries = buildSearchQueries(input);
    let lastError = null;

    // Try OpenStreetMap's Nominatim service. Keep requests spaced out to
    // respect the public service's usage policy.
    for (let index = 0; index < queries.length; index += 1) {
        if (index > 0) await wait(1100);

        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("limit", "5");
        url.searchParams.set("q", queries[index]);
        url.searchParams.set("accept-language", "en");

        try {
            const response = await fetch(url.toString(), {
                headers: { Accept: "application/json" },
            });

            if (response.status === 429) {
                lastError = new Error(
                    "The map search service is temporarily rate-limited. Wait a minute and try again."
                );
                break;
            }

            if (!response.ok) {
                lastError = new Error(
                    `OpenStreetMap search returned HTTP ${response.status}.`
                );
                continue;
            }

            const results = await response.json();
            if (Array.isArray(results) && results.length > 0) {
                return results[0];
            }
        } catch (error) {
            lastError = error;
        }
    }

    // Photon is a second OpenStreetMap-based geocoder. It can find some
    // addresses and landmarks that Nominatim does not return.
    try {
        const photonUrl = new URL("https://photon.komoot.io/api/");
        photonUrl.searchParams.set("q", input.trim());
        photonUrl.searchParams.set("limit", "5");
        photonUrl.searchParams.set("lang", "en");

        const response = await fetch(photonUrl.toString(), {
            headers: { Accept: "application/json" },
        });

        if (response.ok) {
            const data = await response.json();
            const feature = data?.features?.find((item) => {
                const coordinates = item?.geometry?.coordinates;
                return (
                    Array.isArray(coordinates) &&
                    coordinates.length >= 2 &&
                    Number.isFinite(Number(coordinates[0])) &&
                    Number.isFinite(Number(coordinates[1]))
                );
            });

            if (feature) {
                const [lng, lat] = feature.geometry.coordinates;
                const properties = feature.properties || {};
                const displayName = [
                    properties.name,
                    properties.street,
                    properties.city || properties.town || properties.village,
                    properties.state,
                    properties.country,
                ]
                    .filter(Boolean)
                    .filter((part, index, array) => array.indexOf(part) === index)
                    .join(", ");

                return {
                    lat: String(lat),
                    lon: String(lng),
                    display_name: displayName || input.trim(),
                };
            }
        } else {
            lastError = new Error(`Backup place search returned HTTP ${response.status}.`);
        }
    } catch (error) {
        lastError = error;
    }

    if (lastError) {
        throw new Error(
            "The address search service could not be reached. Check your internet connection and try again."
        );
    }

    return null;
}

export default function DisasterMap({

    locations = [],

    setLocations,

    edges = [],

    setEdges,

    source,

    sink,

    setSource,

    setSink,

    onChange,

    simulationResult = null,

}) {

    const [placing, setPlacing] = useState(false);

    const [pending, setPending] = useState(null);

    const [name, setName] = useState("");

    const [type, setType] = useState("shelter");



    const [searchText, setSearchText] = useState("");

    const [searching, setSearching] = useState(false);

    const [locating, setLocating] = useState(false);

    const [target, setTarget] = useState(null);

    const [message, setMessage] = useState("");



    const [from, setFrom] = useState("0");

    const [to, setTo] = useState("1");

    const [capacity, setCapacity] = useState("10");

    const [localError, setLocalError] = useState("");



    const byId = useMemo(

        () => new Map(locations.map((location) => [location.id, location])),

        [locations]

    );



    function invalidate() {

        onChange?.();

    }



    async function searchPlace(event) {

        event.preventDefault();



        if (searching) return;



        const query = searchText.trim();



        if (!query) {

            setMessage("Enter a city, state, town, or address.");

            return;

        }



        setSearching(true);

        setMessage("");



        try {

            const place = await geocodePlace(query);



            if (!place) {

                setMessage(

                    "No matching place found. Check the spelling or try a shorter search, such as Bhubaneswar."

                );

                return;

            }



            const lat = Number(place.lat);

            const lng = Number(place.lon);



            if (

                !Number.isFinite(lat) ||

                !Number.isFinite(lng) ||

                lat < -90 ||

                lat > 90 ||

                lng < -180 ||

                lng > 180

            ) {

                throw new Error(

                    "The search service returned invalid coordinates."

                );

            }



            setTarget({

                center: [lat, lng],

                zoom: 13,

            });



            setMessage(`Showing: ${place.display_name}`);

        } catch (error) {

            setMessage(

                `${error.message || "Place search failed."} Check your connection and try again.`

            );

        } finally {

            setSearching(false);

        }

    }



    function useCurrentLocation() {

        setMessage("");



        if (!navigator.geolocation) {

            setMessage(

                "Your browser does not support location detection. Search for your city instead."

            );

            return;

        }



        setLocating(true);



        navigator.geolocation.getCurrentPosition(

            (position) => {

                setTarget({

                    center: [

                        position.coords.latitude,

                        position.coords.longitude,

                    ],

                    zoom: 15,

                });



                setMessage("Map centred on your current location.");

                setLocating(false);

            },

            (error) => {

                const explanations = {

                    1: "Location permission was denied. Allow location access in your browser settings.",

                    2: "Your location could not be determined. Try again or search for your city.",

                    3: "The location request timed out. Please try again.",

                };



                setMessage(

                    explanations[error.code] ||

                    "Could not access your location. Search for your city instead."

                );



                setLocating(false);

            },

            {

                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 60000,

            }

        );

    }



    function handleMapClick(latlng) {

        setPending({

            lat: Number(latlng.lat.toFixed(6)),

            lng: Number(latlng.lng.toFixed(6)),

        });



        setPlacing(false);

        setLocalError("");

    }



    function addLocation(event) {

        event.preventDefault();



        if (!pending) {

            setLocalError("Click a point on the map first.");

            return;

        }



        if (!name.trim()) {

            setLocalError("Enter a name for this location.");

            return;

        }



        if (locations.length >= 2000) {

            setLocalError("The network limit is 2000 locations.");

            return;

        }



        const id =

            locations.reduce(

                (max, location) => Math.max(max, location.id),

                -1

            ) + 1;



        const newLocation = {

            id,

            name: name.trim(),

            type,

            lat: pending.lat,

            lng: pending.lng,

        };



        setLocations((old) => [...old, newLocation]);



        if (locations.length === 0) setSource(id);

        if (locations.length === 1) setSink(id);



        setPending(null);

        setName("");

        setType("shelter");

        setLocalError("");

        invalidate();

    }



    function removeLocation(id) {

        if (locations.length <= 2) {

            setLocalError("Keep at least two locations in the network.");

            return;

        }



        const remaining = locations

            .filter((location) => location.id !== id)

            .sort((a, b) => a.id - b.id);



        const remap = new Map(

            remaining.map((location, index) => [location.id, index])

        );



        const nextLocations = remaining.map((location, index) => ({

            ...location,

            id: index,

        }));



        const nextEdges = edges

            .filter(

                (edge) =>

                    edge.u !== id &&

                    edge.v !== id &&

                    remap.has(edge.u) &&

                    remap.has(edge.v)

            )

            .map((edge, index) => ({

                ...edge,

                id: index,

                u: remap.get(edge.u),

                v: remap.get(edge.v),

            }));



        const nextSource = id === source ? 0 : remap.get(source);

        let nextSink = id === sink ? null : remap.get(sink);



        const validSource = nextSource ?? 0;



        if (nextSink == null || nextSink === validSource) {

            nextSink = nextLocations.find(

                (location) => location.id !== validSource

            )?.id;

        }



        setLocations(nextLocations);

        setEdges(nextEdges);

        setSource(validSource);

        setSink(nextSink ?? 1);

        setFrom("0");

        setTo("1");

        setLocalError("");

        invalidate();

    }



    function addRoad(event) {

        event.preventDefault();



        const u = Number(from);

        const v = Number(to);

        const cap = Number(capacity);



        if (u === v) {

            setLocalError("Choose two different locations.");

            return;

        }



        if (!byId.has(u) || !byId.has(v)) {

            setLocalError("Both road endpoints must exist.");

            return;

        }



        if (

            !Number.isInteger(cap) ||

            cap < 1 ||

            cap > 500000000

        ) {

            setLocalError(

                "Capacity must be a whole number from 1 to 500,000,000."

            );

            return;

        }



        setEdges((old) => [

            ...old,

            {

                id:

                    old.reduce(

                        (max, edge) => Math.max(max, edge.id),

                        -1

                    ) + 1,

                u,

                v,

                capacity: cap,

            },

        ]);



        setLocalError("");

        invalidate();

    }



    function deleteRoad(id) {

        setEdges((old) =>

            old

                .filter((edge) => edge.id !== id)

                .map((edge, index) => ({ ...edge, id: index }))

        );



        invalidate();

    }



    function chooseRole(id, role) {

        if (role === "source") {

            if (id === sink) {

                setLocalError("Source and destination must differ.");

                return;

            }



            setSource(id);

        } else {

            if (id === source) {

                setLocalError("Source and destination must differ.");

                return;

            }



            setSink(id);

        }



        setLocalError("");

        invalidate();

    }



    return (

        <div className="nexus-map-editor">

            <div className="map-card">

                <h4>

                    <Search size={16} />

                    Find any location

                </h4>



                <form onSubmit={searchPlace} className="map-form-grid">

                    <label>

                        City, state, town, or address

                        <input

                            value={searchText}

                            onChange={(event) => setSearchText(event.target.value)}

                            placeholder="e.g. Bhubaneswar, Odisha, India"

                            autoComplete="street-address"

                        />

                    </label>



                    <button

                        type="submit"

                        className="map-button map-button-active"

                        disabled={searching}

                    >

                        {searching ? (

                            <LoaderCircle size={15} />

                        ) : (

                            <Search size={15} />

                        )}

                        {searching ? "Searching..." : "Search place"}

                    </button>

                </form>



                <button

                    type="button"

                    className="map-button"

                    onClick={useCurrentLocation}

                    disabled={locating}

                >

                    {locating ? (

                        <LoaderCircle size={15} />

                    ) : (

                        <LocateFixed size={15} />

                    )}

                    {locating ? "Finding location..." : "Use my current location"}

                </button>



                {message && (

                    <p className="map-help" role="status">

                        {message}

                    </p>

                )}



                <p className="map-help">

                    Search for cities, states, towns, or addresses worldwide.

                    Current location requires browser permission. Place search

                    requires internet access.

                </p>

            </div>



            <div className="map-toolbar">

                <button

                    type="button"

                    className={

                        placing

                            ? "map-button map-button-active"

                            : "map-button"

                    }

                    onClick={() => {

                        setPlacing((old) => !old);

                        setPending(null);

                        setLocalError("");

                    }}

                >

                    <MapPin size={14} />

                    {placing ? "Click map to place..." : "Place a location"}

                </button>



                {placing && (

                    <span className="map-hint">

                        Click anywhere on the map to add a location.

                    </span>

                )}

            </div>



            <div className="nexus-map-frame">

                <MapContainer

                    center={DEFAULT_CENTER}

                    zoom={12}

                    scrollWheelZoom

                    className="nexus-leaflet-map"

                >

                    <MapController target={target} />



                    <TileLayer

                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                    />



                    <MapClickHandler

                        enabled={placing}

                        onMapClick={handleMapClick}

                    />



                    {edges.map((edge) => {
                        const a = byId.get(edge.u);
                        const b = byId.get(edge.v);
                        if (!a || !b) return null;
                        const affected = simulationResult?.affected_edges?.find(
                            (item) => item.edge_id === edge.id
                        );
                        const blocked = Boolean(affected && affected.new_capacity === 0);
                        const capacity = affected ? affected.new_capacity : edge.capacity;
                        return (
                            <Polyline
                                key={edge.id}
                                positions={[[a.lat, a.lng], [b.lat, b.lng]]}
                                pathOptions={{
                                    color: blocked ? "#a92e43" : affected ? "#e05268" : "#bd668a",
                                    weight: affected ? 5 : 3,
                                    opacity: affected ? 1 : 0.85,
                                    dashArray: affected ? undefined : "7 7",
                                }}
                            >
                                <Popup>
                                    <strong>{a.name} → {b.name}</strong>
                                    <br />Original capacity: {edge.capacity}
                                    <br />Simulated capacity: {capacity}
                                    {affected && <p style={{ color: "#c34865", marginBottom: 0 }}>{blocked ? "Road blocked" : "Road affected by disaster"}</p>}
                                    <small>Simulated connection, not verified road routing.</small>
                                </Popup>
                            </Polyline>
                        );
                    })}

                    {locations.map((location) => (

                        <Marker

                            key={location.id}

                            position={[location.lat, location.lng]}

                            icon={markerIcon(location.type)}

                        >

                            <Popup>

                                <div className="map-popup">

                                    <strong>

                                        {location.id} · {location.name}

                                    </strong>



                                    <span>{TYPES[location.type]?.label}</span>



                                    <small>

                                        {location.lat.toFixed(5)}, {location.lng.toFixed(5)}

                                    </small>



                                    <button

                                        type="button"

                                        className="map-remove"

                                        onClick={() => removeLocation(location.id)}

                                    >

                                        <Trash2 size={12} />

                                        Remove location

                                    </button>

                                </div>

                            </Popup>

                        </Marker>

                    ))}

                </MapContainer>

            </div>



            {pending && (

                <form className="map-card location-form" onSubmit={addLocation}>

                    <h4>

                        <MapPin size={15} />

                        Name your new location

                    </h4>



                    <div className="map-form-grid">

                        <label>

                            Location name

                            <input

                                value={name}

                                onChange={(event) => setName(event.target.value)}

                                placeholder="e.g. Northside Shelter"

                                required

                            />

                        </label>



                        <label>

                            Location type

                            <select

                                value={type}

                                onChange={(event) => setType(event.target.value)}

                            >

                                {Object.entries(TYPES).map(([key, value]) => (

                                    <option key={key} value={key}>

                                        {value.label}

                                    </option>

                                ))}

                            </select>

                        </label>

                    </div>



                    <div className="map-form-actions">

                        <button

                            type="submit"

                            className="map-button map-button-active"

                        >

                            <Plus size={14} />

                            Add to network

                        </button>



                        <button

                            type="button"

                            className="map-button"

                            onClick={() => setPending(null)}

                        >

                            Cancel

                        </button>

                    </div>

                </form>

            )}



            <form className="map-card" onSubmit={addRoad}>

                <h4>

                    <Plus size={15} />

                    Connect two locations

                </h4>



                <div className="map-form-grid map-road-grid">

                    <label>

                        From

                        <select

                            value={from}

                            onChange={(event) => setFrom(event.target.value)}

                        >

                            {locations.map((location) => (

                                <option key={location.id} value={location.id}>

                                    {location.id} · {location.name}

                                </option>

                            ))}

                        </select>

                    </label>



                    <label>

                        To

                        <select

                            value={to}

                            onChange={(event) => setTo(event.target.value)}

                        >

                            {locations.map((location) => (

                                <option key={location.id} value={location.id}>

                                    {location.id} · {location.name}

                                </option>

                            ))}

                        </select>

                    </label>



                    <label>

                        Capacity

                        <input

                            type="number"

                            min="1"

                            max="500000000"

                            value={capacity}

                            onChange={(event) => setCapacity(event.target.value)}

                            required

                        />

                    </label>



                    <button

                        type="submit"

                        className="map-button map-button-active"

                    >

                        <Plus size={14} />

                        Add road

                    </button>

                </div>



                <p className="map-help">

                    Roads are directed. Add a reverse road separately if travel

                    is possible in both directions.

                </p>

            </form>



            <div className="map-location-list">

                <div className="map-list-heading">

                    <strong>Locations in this network</strong>

                    <span>{locations.length}</span>

                </div>



                {locations.map((location) => (

                    <div className="map-location-row" key={location.id}>

                        <span className={`type-dot type-${location.type}`} />



                        <div className="map-location-name">

                            <strong>

                                {location.id} · {location.name}

                            </strong>

                            <small>

                                <TypeIcon type={location.type} />

                                {TYPES[location.type]?.label}

                            </small>

                        </div>



                        <div className="map-role-buttons">

                            <button

                                type="button"

                                className={

                                    source === location.id

                                        ? "role-source chosen"

                                        : "role-source"

                                }

                                onClick={() => chooseRole(location.id, "source")}

                            >

                                Source

                            </button>



                            <button

                                type="button"

                                className={

                                    sink === location.id

                                        ? "role-sink chosen"

                                        : "role-sink"

                                }

                                onClick={() => chooseRole(location.id, "sink")}

                            >

                                Destination

                            </button>

                        </div>



                        <button

                            type="button"

                            className="map-delete-location"

                            title="Remove location"

                            onClick={() => removeLocation(location.id)}

                        >

                            <Trash2 size={14} />

                        </button>

                    </div>

                ))}

            </div>



            <div className="map-roads-list">

                <div className="map-list-heading">

                    <strong>Shared road connections</strong>

                    <span>{edges.length}</span>

                </div>



                {edges.map((edge) => (

                    <div className="map-road-row" key={edge.id}>

                        <span>

                            {edge.u} → {edge.v}

                        </span>



                        <strong>{edge.capacity} units</strong>



                        <button

                            type="button"

                            title="Delete road"

                            onClick={() => deleteRoad(edge.id)}

                        >

                            <Trash2 size={13} />

                        </button>

                    </div>

                ))}



                {!edges.length && (

                    <p className="map-help">No roads connected yet.</p>

                )}

            </div>



            {localError && (

                <div className="map-error" role="alert">

                    {localError}

                    <button

                        type="button"

                        onClick={() => setLocalError("")}

                    >

                        ×

                    </button>

                </div>

            )}

        </div>

    );

}
