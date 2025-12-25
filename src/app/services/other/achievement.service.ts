import { Injectable } from '@angular/core';
import { Registration } from '../api/bes3/ebike-registration.service';

/**
 * Types of achievements
 */
export enum AchievementType {
  ACTIVITIES_1 = 'ACTIVITIES_1',
  ACTIVITIES_10 = 'ACTIVITIES_10',
  DISTANCE_10KM = 'DISTANCE_10KM',
  DISTANCE_100KM = 'DISTANCE_100KM',
  DISTANCE_1000KM = 'DISTANCE_1000KM',
  DISTANCE_3300KM = 'DISTANCE_3300KM',
  DISTANCE_3500KM = 'DISTANCE_3500KM',
  DISTANCE_40075KM = 'DISTANCE_40075KM',
  ELEVATION_GAIN_4806M = 'ELEVATION_GAIN_4806M',
  ELEVATION_GAIN_8848_M = 'ELEVATION_GAIN_8848_M',
  REGION_BADEN_WURTTEMBERG = 'REGION_BADEN_WURTTEMBERG',
  REGION_BAYERN = 'REGION_BAYERN',
  REGION_BERLIN = 'REGION_BERLIN',
  REGION_BRANDENBURG = 'REGION_BRANDENBURG',
  REGION_BREMEN = 'REGION_BREMEN',
  REGION_HAMBURG = 'REGION_HAMBURG',
  REGION_HESSEN = 'REGION_HESSEN',
  REGION_MECKLENBURG_VORPOMMERN = 'REGION_MECKLENBURG_VORPOMMERN',
  REGION_NIEDERSACHSEN = 'REGION_NIEDERSACHSEN',
  REGION_NORDRHEIN_WESTFALEN = 'REGION_NORDRHEIN_WESTFALEN',
  REGION_RHEINLAND_PFALZ = 'REGION_RHEINLAND_PFALZ',
  REGION_SAARLAND = 'REGION_SAARLAND',
  REGION_SACHSEN = 'REGION_SACHSEN',
  REGION_SACHSEN_ANHALT = 'REGION_SACHSEN_ANHALT',
  REGION_SCHLESWIG_HOLSTEIN = 'REGION_SCHLESWIG_HOLSTEIN',
  REGION_THURINGEN = 'REGION_THURINGEN',
  REGISTRATION_BIKE = 'REGISTRATION_BIKE',
  REGISTRATION_COMPONENT = 'REGISTRATION_COMPONENT',
  BATTERY_CHARGE_CYCLES_10 = 'BATTERY_CHARGE_CYCLES_10',
  BATTERY_CHARGE_CYCLES_100 = 'BATTERY_CHARGE_CYCLES_100',
  BATTERY_CHARGE_CYCLES_1000 = 'BATTERY_CHARGE_CYCLES_1000',
}

/**
 * Represents an achievement
 */
export interface Achievement {
  /** Date */
  date?: string;
  /** Icon */
  icon?: string;
  /** Translation */
  translation?: string;
  /** Achieved flag */
  achieved?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  /** Achievements */
  achievementsActivities = new Map<AchievementType, Achievement>([
    [
      AchievementType.ACTIVITIES_1,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.activities.1',
      },
    ],
    [
      AchievementType.ACTIVITIES_10,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.activities.10',
      },
    ],
  ]);

  /** Achievements */
  achievementsDistances = new Map<AchievementType, Achievement>([
    [
      AchievementType.DISTANCE_10KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance.10km',
      },
    ],
    [
      AchievementType.DISTANCE_100KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance.100km',
      },
    ],
    [
      AchievementType.DISTANCE_1000KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance.1000km',
      },
    ],
    [
      AchievementType.DISTANCE_3300KM,
      {
        icon: 'assets/achievements/spain-flag.png',
        translation: 'terms.distance.3300km',
      },
    ],
    [
      AchievementType.DISTANCE_3500KM,
      {
        icon: 'assets/achievements/france-flag.png',
        translation: 'terms.distance.3500km',
      },
    ],
    [
      AchievementType.DISTANCE_40075KM,
      {
        icon: 'assets/achievements/earth.png',
        translation: 'terms.distance.40075km',
      },
    ],
  ]);

  /** Achievements */
  achievementsElevationGain = new Map<AchievementType, Achievement>([
    [
      AchievementType.ELEVATION_GAIN_4806M,
      {
        icon: 'assets/achievements/mountains.png',
        translation: 'terms.elevation-gain.4806m',
      },
    ],
    [
      AchievementType.ELEVATION_GAIN_8848_M,
      {
        icon: 'assets/achievements/mountains.png',
        translation: 'terms.elevation-gain.8848m',
      },
    ],
  ]);

  /** Achievements */
  achievementsRegistrations = new Map<AchievementType, Achievement>([
    [
      AchievementType.REGISTRATION_BIKE,
      {
        icon: 'assets/achievements/form.png',
        translation: 'terms.registration.ebike',
      },
    ],
    [
      AchievementType.REGISTRATION_COMPONENT,
      {
        icon: 'assets/achievements/form.png',
        translation: 'terms.registration.component',
      },
    ],
  ]);

  /** Achievements */
  achievementsBatteryChargeCycles = new Map<AchievementType, Achievement>([
    [
      AchievementType.BATTERY_CHARGE_CYCLES_10,
      {
        icon: 'assets/achievements/eco-battery.png',
        translation: 'terms.battery-charge-cycles.10',
      },
    ],
    [
      AchievementType.BATTERY_CHARGE_CYCLES_100,
      {
        icon: 'assets/achievements/eco-battery.png',
        translation: 'terms.battery-charge-cycles.100',
      },
    ],
    [
      AchievementType.BATTERY_CHARGE_CYCLES_1000,
      {
        icon: 'assets/achievements/eco-battery.png',
        translation: 'terms.battery-charge-cycles.1000',
      },
    ],
  ]);

  /** Achievements */
  achievementsRegions = new Map<AchievementType, Achievement>([
    [
      AchievementType.REGION_BADEN_WURTTEMBERG,
      {
        icon: 'assets/achievements/region/baden-wurttemberg.png',
        translation: 'terms.region.baden-wurttemberg',
      },
    ],
    [
      AchievementType.REGION_BAYERN,
      {
        icon: 'assets/achievements/region/bayern.png',
        translation: 'terms.region.bayern',
      },
    ],
    [
      AchievementType.REGION_BERLIN,
      {
        icon: 'assets/achievements/region/berlin.png',
        translation: 'terms.region.berlin',
      },
    ],
    [
      AchievementType.REGION_BRANDENBURG,
      {
        icon: 'assets/achievements/region/brandenburg.png',
        translation: 'terms.region.berlin',
      },
    ],
    [
      AchievementType.REGION_BREMEN,
      {
        icon: 'assets/achievements/region/bremen.png',
        translation: 'terms.region.bremen',
      },
    ],
    [
      AchievementType.REGION_HAMBURG,
      {
        icon: 'assets/achievements/region/hamburg.png',
        translation: 'terms.region.hamburg',
      },
    ],
    [
      AchievementType.REGION_HESSEN,
      {
        icon: 'assets/achievements/region/hessen.png',
        translation: 'terms.region.hessen',
      },
    ],
    [
      AchievementType.REGION_MECKLENBURG_VORPOMMERN,
      {
        icon: 'assets/achievements/region/mecklenburg-vorpommern.png',
        translation: 'terms.region.mecklenburg-vorpommern',
      },
    ],
    [
      AchievementType.REGION_NIEDERSACHSEN,
      {
        icon: 'assets/achievements/region/niedersachsen.png',
        translation: 'terms.region.niedersachsen',
      },
    ],
    [
      AchievementType.REGION_NORDRHEIN_WESTFALEN,
      {
        icon: 'assets/achievements/region/nordrhein-westfalen.png',
        translation: 'terms.region.nordrhein-westfalen',
      },
    ],
    [
      AchievementType.REGION_RHEINLAND_PFALZ,
      {
        icon: 'assets/achievements/region/rheinland-pfalz.png',
        translation: 'terms.region.rheinland-pfalz',
      },
    ],
    [
      AchievementType.REGION_SAARLAND,
      {
        icon: 'assets/achievements/region/saarland.png',
        translation: 'terms.region.saarland',
      },
    ],
    [
      AchievementType.REGION_SACHSEN,
      {
        icon: 'assets/achievements/region/sachsen.png',
        translation: 'terms.region.sachsen',
      },
    ],
    [
      AchievementType.REGION_SACHSEN_ANHALT,
      {
        icon: 'assets/achievements/region/sachsen-anhalt.png',
        translation: 'terms.region.sachsen-anhalt',
      },
    ],
    [
      AchievementType.REGION_SCHLESWIG_HOLSTEIN,
      {
        icon: 'assets/achievements/region/schleswig-holstein.png',
        translation: 'terms.region.schleswig-holstein',
      },
    ],
    [
      AchievementType.REGION_THURINGEN,
      {
        icon: 'assets/achievements/region/thuringen.png',
        translation: 'terms.region.thuringen',
      },
    ],
  ]);

  /**
   * Evaluates achievements related to activities
   * @param achievements achievements
   * @param totalActivityCount total activity count
   * @param date string
   */
  evaluateActivities(
    achievements: Map<AchievementType, Achievement>,
    totalActivityCount: number,
    date: string,
  ) {
    if (
      !achievements.get(AchievementType.ACTIVITIES_1)?.date &&
      totalActivityCount >= 1
    ) {
      achievements.set(AchievementType.ACTIVITIES_1, {
        ...achievements.get(AchievementType.ACTIVITIES_1),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.ACTIVITIES_10)?.date &&
      totalActivityCount >= 10
    ) {
      achievements.set(AchievementType.ACTIVITIES_10, {
        ...achievements.get(AchievementType.ACTIVITIES_10),
        date: date,
        achieved: true,
      });
    }

    return new Map(achievements);
  }

  /**
   * Evaluates achievements related to distances
   * @param achievements achievements
   * @param totalDistance total distance
   * @param date date
   */
  evaluateDistances(
    achievements: Map<AchievementType, Achievement>,
    totalDistance: number,
    date: string,
  ) {
    if (
      !achievements.get(AchievementType.DISTANCE_10KM)?.date &&
      totalDistance >= 10_000
    ) {
      achievements.set(AchievementType.DISTANCE_10KM, {
        ...achievements.get(AchievementType.DISTANCE_10KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_100KM)?.date &&
      totalDistance >= 100_000
    ) {
      achievements.set(AchievementType.DISTANCE_100KM, {
        ...achievements.get(AchievementType.DISTANCE_100KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_1000KM)?.date &&
      totalDistance >= 1_000_000
    ) {
      achievements.set(AchievementType.DISTANCE_1000KM, {
        ...achievements.get(AchievementType.DISTANCE_1000KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_3500KM)?.date &&
      totalDistance >= 3_500_000
    ) {
      achievements.set(AchievementType.DISTANCE_3500KM, {
        ...achievements.get(AchievementType.DISTANCE_3500KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_3300KM)?.date &&
      totalDistance >= 3_300_000
    ) {
      achievements.set(AchievementType.DISTANCE_3300KM, {
        ...achievements.get(AchievementType.DISTANCE_3300KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_40075KM)?.date &&
      totalDistance >= 40_075_000
    ) {
      achievements.set(AchievementType.DISTANCE_40075KM, {
        ...achievements.get(AchievementType.DISTANCE_40075KM),
        date: date,
        achieved: true,
      });
    }

    return new Map(achievements);
  }

  /**
   * Evaluates achievements related to distances
   * @param achievements achievements
   * @param totalElevationGain total elevation gain
   * @param date date
   */
  evaluateElevationGain(
    achievements: Map<AchievementType, Achievement>,
    totalElevationGain: number,
    date: string,
  ) {
    if (
      !achievements.get(AchievementType.ELEVATION_GAIN_4806M)?.date &&
      totalElevationGain >= 4806
    ) {
      achievements.set(AchievementType.ELEVATION_GAIN_4806M, {
        ...achievements.get(AchievementType.ELEVATION_GAIN_4806M),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.ELEVATION_GAIN_8848_M)?.date &&
      totalElevationGain >= 8848
    ) {
      achievements.set(AchievementType.ELEVATION_GAIN_8848_M, {
        ...achievements.get(AchievementType.ELEVATION_GAIN_8848_M),
        date: date,
        achieved: true,
      });
    }

    return new Map(achievements);
  }

  /**
   * Evaluates achievements related to registrations
   * @param achievements achievements
   * @param registration registration
   */
  evaluateRegistration(
    achievements: Map<AchievementType, Achievement>,
    registration: Registration,
  ) {
    if (
      !achievements.get(AchievementType.REGISTRATION_BIKE)?.date &&
      registration.bikeRegistration
    ) {
      achievements.set(AchievementType.REGISTRATION_BIKE, {
        ...achievements.get(AchievementType.REGISTRATION_BIKE),
        date: registration.createdAt,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGISTRATION_COMPONENT)?.date &&
      registration.componentRegistration
    ) {
      achievements.set(AchievementType.REGISTRATION_COMPONENT, {
        ...achievements.get(AchievementType.REGISTRATION_COMPONENT),
        date: registration.createdAt,
        achieved: true,
      });
    }

    return new Map(achievements);
  }

  /**
   * Evaluates achievements related to battery charge cycles
   * @param achievements achievements
   * @param totalBatteryChargeCycles total battery charge cycles
   */
  evaluateBatteryChargeCycles(
    achievements: Map<AchievementType, Achievement>,
    totalBatteryChargeCycles: number,
  ) {
    if (
      !achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_10)?.date &&
      totalBatteryChargeCycles >= 10
    ) {
      achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_10, {
        ...achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_10),
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_100)?.date &&
      totalBatteryChargeCycles >= 100
    ) {
      achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_100, {
        ...achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_100),
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_1000)?.date &&
      totalBatteryChargeCycles >= 1000
    ) {
      achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_1000, {
        ...achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_1000),
        achieved: true,
      });
    }

    return new Map(achievements);
  }

  /**
   * Evaluates achievements related to regions
   * @param achievements achievements
   * @param federalState federal state
   * @param date date
   */
  evaluateRegions(
    achievements: Map<AchievementType, Achievement>,
    federalState: string,
    date: string,
  ) {
    if (
      !achievements.get(AchievementType.REGION_BADEN_WURTTEMBERG)?.date &&
      federalState === 'Baden-Württemberg'
    ) {
      achievements.set(AchievementType.REGION_BADEN_WURTTEMBERG, {
        ...achievements.get(AchievementType.REGION_BADEN_WURTTEMBERG),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_BERLIN)?.date &&
      federalState === 'Berlin'
    ) {
      achievements.set(AchievementType.REGION_BERLIN, {
        ...achievements.get(AchievementType.REGION_BERLIN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_BRANDENBURG)?.date &&
      federalState === 'Brandenburg'
    ) {
      achievements.set(AchievementType.REGION_BRANDENBURG, {
        ...achievements.get(AchievementType.REGION_BRANDENBURG),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_BREMEN)?.date &&
      federalState === 'Bremen'
    ) {
      achievements.set(AchievementType.REGION_BREMEN, {
        ...achievements.get(AchievementType.REGION_BREMEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_HAMBURG)?.date &&
      federalState === 'Hamburg'
    ) {
      achievements.set(AchievementType.REGION_HAMBURG, {
        ...achievements.get(AchievementType.REGION_HAMBURG),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_HESSEN)?.date &&
      federalState === 'Hessen'
    ) {
      achievements.set(AchievementType.REGION_HESSEN, {
        ...achievements.get(AchievementType.REGION_HESSEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_MECKLENBURG_VORPOMMERN)?.date &&
      federalState === 'Mecklenburg-Vorpommern'
    ) {
      achievements.set(AchievementType.REGION_MECKLENBURG_VORPOMMERN, {
        ...achievements.get(AchievementType.REGION_MECKLENBURG_VORPOMMERN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_NIEDERSACHSEN)?.date &&
      federalState === 'Niedersachsen'
    ) {
      achievements.set(AchievementType.REGION_NIEDERSACHSEN, {
        ...achievements.get(AchievementType.REGION_NIEDERSACHSEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_NORDRHEIN_WESTFALEN)?.date &&
      federalState === 'Nordrhein-Westfalen'
    ) {
      achievements.set(AchievementType.REGION_NORDRHEIN_WESTFALEN, {
        ...achievements.get(AchievementType.REGION_NORDRHEIN_WESTFALEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_RHEINLAND_PFALZ)?.date &&
      federalState === 'Rheinland-Pfalz'
    ) {
      achievements.set(AchievementType.REGION_RHEINLAND_PFALZ, {
        ...achievements.get(AchievementType.REGION_RHEINLAND_PFALZ),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SAARLAND)?.date &&
      federalState === 'Saarland'
    ) {
      achievements.set(AchievementType.REGION_SAARLAND, {
        ...achievements.get(AchievementType.REGION_SAARLAND),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SACHSEN_ANHALT)?.date &&
      federalState === 'Sachsen-Anhalt'
    ) {
      achievements.set(AchievementType.REGION_SACHSEN_ANHALT, {
        ...achievements.get(AchievementType.REGION_SACHSEN_ANHALT),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SACHSEN)?.date &&
      federalState === 'Sachsen'
    ) {
      achievements.set(AchievementType.REGION_SACHSEN, {
        ...achievements.get(AchievementType.REGION_SACHSEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SCHLESWIG_HOLSTEIN)?.date &&
      federalState === 'Schleswig-Holstein'
    ) {
      achievements.set(AchievementType.REGION_SCHLESWIG_HOLSTEIN, {
        ...achievements.get(AchievementType.REGION_SCHLESWIG_HOLSTEIN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_THURINGEN)?.date &&
      federalState === 'Thüringen'
    ) {
      achievements.set(AchievementType.REGION_THURINGEN, {
        ...achievements.get(AchievementType.REGION_THURINGEN),
        date: date,
        achieved: true,
      });
    }

    return new Map(achievements);
  }
}
