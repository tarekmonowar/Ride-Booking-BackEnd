"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistanceInKm = calculateDistanceInKm;
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function calculateDistanceInKm(from, to) {
    const earthRadiusKm = 6371;
    const deltaLat = toRadians(to.lat - from.lat);
    const deltaLng = toRadians(to.lng - from.lng);
    const fromLatRad = toRadians(from.lat);
    const toLatRad = toRadians(to.lat);
    const a = Math.sin(deltaLat / 2) ** 2 +
        Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(deltaLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    return distance;
}
