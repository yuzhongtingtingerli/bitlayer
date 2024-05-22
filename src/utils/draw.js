
import * as THREE from "three";
import { borderColor,gridSizeX,gridSizeY } from "./config.js";
export const drawGrid = (texture, x, y) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const geometry = new THREE.PlaneGeometry(gridSizeX, gridSizeY);
  const grid = new THREE.Mesh(geometry, material);
  grid.position.x = x;
  grid.position.y = y;
  return grid;
};

export const drawBorder = (x, y) => {
    const material = new THREE.MeshBasicMaterial({
        color: borderColor,
    })
    const geometry = new THREE.PlaneGeometry(gridSizeX, gridSizeY);
    const edges = new THREE.EdgesGeometry(geometry);
    const grid = new THREE.LineSegments(edges, material);
    grid.position.x = x;
    grid.position.y = y;
    return grid;
  };