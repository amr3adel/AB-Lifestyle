import type { UnitSystem } from "../types";

export function kgToLb(value: number | "") {
  return value === "" ? "" : Math.round(value * 2.20462);
}

export function lbToKg(value: number | "") {
  return value === "" ? "" : Math.round((value / 2.20462) * 10) / 10;
}

export function cmToIn(value: number | "") {
  return value === "" ? "" : Math.round(value / 2.54);
}

export function inToCm(value: number | "") {
  return value === "" ? "" : Math.round(value * 2.54);
}

export function displayWeight(valueKg: number | "", unitSystem: UnitSystem) {
  return unitSystem === "imperial" ? kgToLb(valueKg) : valueKg;
}

export function displayHeight(valueCm: number | "", unitSystem: UnitSystem) {
  return unitSystem === "imperial" ? cmToIn(valueCm) : valueCm;
}

export function normalizeWeight(value: number | "", unitSystem: UnitSystem) {
  return unitSystem === "imperial" ? lbToKg(value) : value;
}

export function normalizeHeight(value: number | "", unitSystem: UnitSystem) {
  return unitSystem === "imperial" ? inToCm(value) : value;
}

export function weightLabel(unitSystem: UnitSystem) {
  return unitSystem === "imperial" ? "lb" : "kg";
}

export function heightLabel(unitSystem: UnitSystem) {
  return unitSystem === "imperial" ? "in" : "cm";
}
