export interface Shot {
    shotX: number,
    shotY: number,
    screened: boolean,
    changedDirection: boolean,
    crossedCenterline: boolean,
    shotDistanceInFeet: number,
    shotAngle: number,
    expectedSavePercentage: number
}