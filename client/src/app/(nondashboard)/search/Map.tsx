'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppSelector } from '@/state/redux';
import { useGetPropertiesQuery } from '@/state/api';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

function normalizeToLngLat(coords?: number[] | null) {
  if (!coords || coords.length < 2) return null;
  const a = Number(coords[0]);
  const b = Number(coords[1]);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  const aLooksLat = a >= -90 && a <= 90;
  const bLooksLng = b >= -180 && b <= 180;
  const aLooksLng = a >= -180 && a <= 180;
  const bLooksLat = b >= -90 && b <= 90;

  if (aLooksLat && bLooksLng && !(aLooksLng && bLooksLat)) {
    return [b, a];
  }

  return [a, b];
}

// India center + reasonable zoom
const INDIA_CENTER: [number, number] = [78.9629, 20.5937]; // [lng, lat]
const INDIA_ZOOM = 4.7;

const DEFAULT_CENTER: [number, number] = [-74.5, 40]; // fallback if everything fails
const DEFAULT_ZOOM = 9;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const styleUrl = 'mapbox://styles/astitva1605/cmindlr6i00ly01r01vk4gav4';

  // helper: center map to India
  const centerToIndia = (map: mapboxgl.Map, animate = true) => {
    if (animate) {
      map.flyTo({ center: INDIA_CENTER, zoom: INDIA_ZOOM, speed: 0.9 });
    } else {
      map.setCenter(INDIA_CENTER);
      map.setZoom(INDIA_ZOOM);
    }
    console.debug('[Map] centered to India', INDIA_CENTER, 'zoom', INDIA_ZOOM);
  };

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    // compute desired center
    let center: [number, number] | null = null;
    const normalizedFromFilters = normalizeToLngLat(
      filters.coordinates ?? null
    );
    if (normalizedFromFilters) {
      center = normalizedFromFilters as [number, number];
      console.debug('[Map] Using filter coordinates:', center);
    } else if (properties.length > 0) {
      // use first property coords
      const first = properties[0];
      const lng = Number(first.location?.coordinates?.longitude);
      const lat = Number(first.location?.coordinates?.latitude);
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
        center = [lng, lat];
        console.debug('[Map] Using first property coords:', center);
      }
    }

    if (!center) {
      // if we don't have any coords, we will center to India (below)
      center = null;
    }

    if (!mapRef.current) {
      const initialCenter = center ?? INDIA_CENTER ?? DEFAULT_CENTER;
      const initialZoom = center ? DEFAULT_ZOOM : INDIA_ZOOM;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: styleUrl,
        center: initialCenter,
        zoom: initialZoom,
      });

      // minimal resize & window listener
      const t = setTimeout(() => mapRef.current?.resize(), 600);
      const onWindowResize = () => mapRef.current?.resize();
      window.addEventListener('resize', onWindowResize);
      mapRef.current.once('remove', () => {
        clearTimeout(t);
        window.removeEventListener('resize', onWindowResize);
      });

      mapRef.current.on('styledata', () => {
        console.debug(
          '[Map] styledata fired, center currently:',
          mapRef.current?.getCenter().toArray(),
          'zoom:',
          mapRef.current?.getZoom()
        );
      });
    }

    const map = mapRef.current!;

    const addMarkers = () => {
      // clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (!properties || properties.length === 0) {
        console.debug('[Map] no properties to render, will center to India');
        centerToIndia(map, true);
        return;
      }

      // if multiple properties, compute bounds and fit
      if (properties.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        properties.forEach((p) => {
          const lng = Number(p.location?.coordinates?.longitude);
          const lat = Number(p.location?.coordinates?.latitude);
          if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
            bounds.extend([lng, lat]);
          }
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
          console.debug('[Map] fitBounds to properties with padding 80');
        } else if (center) {
          map.setCenter(center);
          map.setZoom(DEFAULT_ZOOM);
        } else {
          centerToIndia(map);
        }
      } else {
        // single property: set center to it (or center param)
        const p = properties[0];
        const lng = Number(p.location?.coordinates?.longitude);
        const lat = Number(p.location?.coordinates?.latitude);
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
          map.flyTo({ center: [lng, lat], zoom: 12 });
          console.debug('[Map] flyTo single property center', [lng, lat]);
        } else if (center) {
          map.setCenter(center);
          map.setZoom(DEFAULT_ZOOM);
        } else {
          centerToIndia(map);
        }
      }

      // add markers
      properties.forEach((property, idx) => {
        const lng = Number(property.location?.coordinates?.longitude);
        const lat = Number(property.location?.coordinates?.latitude);
        if (Number.isNaN(lng) || Number.isNaN(lat)) {
          console.warn(
            '[Map] skipping property with invalid coords',
            property.id
          );
          return;
        }

        const marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(
              `
                <div class="marker-popup">
                  <div class="marker-popup-image"></div>
                  <div>
                    <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
                    <p class="marker-popup-price">
                      $${property.pricePerMonth}
                      <span class="marker-popup-price-unit"> / month</span>
                    </p>
                  </div>
                </div>
              `
            )
          )
          .addTo(map);

        try {
          const el = marker.getElement();
          const path = el.querySelector("path[fill='#3FB1CE']");
          if (path) path.setAttribute('fill', '#000000');
        } catch (err) {
          console.log(err);
        }

        markersRef.current.push(marker);
        console.debug(
          `[Map] marker ${idx} added for property ${property.id} -> [${lng},${lat}]`
        );
      });
    };

    if (map.isStyleLoaded && map.isStyleLoaded()) {
      console.debug('[Map] style already loaded, adding markers now');
      addMarkers();
    } else {
      map.once('load', () => {
        console.debug('[Map] style loaded, adding markers now');
        addMarkers();
      });
    }

    // if there was no center but we created the map, ensure we center to India
    if (!center && map.isStyleLoaded && map.isStyleLoaded()) {
      // we already handled inside addMarkers, but keep a defensive fallback
      centerToIndia(map, false);
    }

    // small resize after layout settle
    setTimeout(() => map.resize(), 700);

    return () => {
      // remove markers, but keep map instance alive across small re-renders
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      // If you want to fully tear down the map when this component unmounts, uncomment:
      // map.remove(); mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, properties, filters.coordinates, styleUrl]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: '650px',
          width: '100%',
        }}
      />
    </div>
  );
};

export default Map;
