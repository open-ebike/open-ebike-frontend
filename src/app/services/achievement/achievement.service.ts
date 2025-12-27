import { Injectable } from '@angular/core';
import { Registration } from '../api/bes3/ebike-registration.service';
import { TimePeriod } from './bes3/bes3-achievement.service';

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
  /** Type */
  type?: AchievementType | string;
  /** Date */
  date?: string;
  /** Icon */
  icon?: string;
  /** Translation */
  translation?: string;
  /** Translation */
  translationSharePicture?: string;
  /** Translation context */
  translationContext?: {};
  /** Achieved flag */
  achieved?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  //
  // Initialization
  //

  /**
   * Dynamically initializes achievements based on time periods
   * @param firstActivityDate date of first activity
   */
  initializeAchievementsTimePeriods(
    firstActivityDate: Date | null,
  ): Map<number, Map<string, Achievement>> {
    const achievementsTimePeriods = new Map<number, Map<string, Achievement>>();
    this.getTimePeriods(firstActivityDate, new Date()).forEach((timePeriod) => {
      if (!achievementsTimePeriods.has(timePeriod.year)) {
        achievementsTimePeriods.set(
          timePeriod.year,
          new Map<string, Achievement>(),
        );
      }

      const year = timePeriod.year;
      const month = timePeriod.month.toString().padStart(2, '0');
      const achievementType = `TIME_PERIOD_ACTIVE_${year}_${month}`;

      achievementsTimePeriods.get(timePeriod.year)?.set(achievementType, {
        icon: `assets/achievements/months/${month}.png`,
        translation: `terms.badges.time-periods.${month}`,
        translationSharePicture: `terms.share-pictures.time-periods.${month}`,
        translationContext: { year },
      });
    });

    return achievementsTimePeriods;
  }

  //
  // Evaluation
  //

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
      !achievements.get(AchievementType.ACTIVITIES_1)?.achieved &&
      totalActivityCount >= 1
    ) {
      achievements.set(AchievementType.ACTIVITIES_1, {
        ...achievements.get(AchievementType.ACTIVITIES_1),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.ACTIVITIES_10)?.achieved &&
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
      !achievements.get(AchievementType.DISTANCE_10KM)?.achieved &&
      totalDistance >= 10_000
    ) {
      achievements.set(AchievementType.DISTANCE_10KM, {
        ...achievements.get(AchievementType.DISTANCE_10KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_100KM)?.achieved &&
      totalDistance >= 100_000
    ) {
      achievements.set(AchievementType.DISTANCE_100KM, {
        ...achievements.get(AchievementType.DISTANCE_100KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_1000KM)?.achieved &&
      totalDistance >= 1_000_000
    ) {
      achievements.set(AchievementType.DISTANCE_1000KM, {
        ...achievements.get(AchievementType.DISTANCE_1000KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_3500KM)?.achieved &&
      totalDistance >= 3_500_000
    ) {
      achievements.set(AchievementType.DISTANCE_3500KM, {
        ...achievements.get(AchievementType.DISTANCE_3500KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_3300KM)?.achieved &&
      totalDistance >= 3_300_000
    ) {
      achievements.set(AchievementType.DISTANCE_3300KM, {
        ...achievements.get(AchievementType.DISTANCE_3300KM),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.DISTANCE_40075KM)?.achieved &&
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
      !achievements.get(AchievementType.ELEVATION_GAIN_4806M)?.achieved &&
      totalElevationGain >= 4806
    ) {
      achievements.set(AchievementType.ELEVATION_GAIN_4806M, {
        ...achievements.get(AchievementType.ELEVATION_GAIN_4806M),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.ELEVATION_GAIN_8848_M)?.achieved &&
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
      !achievements.get(AchievementType.REGISTRATION_BIKE)?.achieved &&
      registration.bikeRegistration
    ) {
      achievements.set(AchievementType.REGISTRATION_BIKE, {
        ...achievements.get(AchievementType.REGISTRATION_BIKE),
        date: registration.createdAt,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGISTRATION_COMPONENT)?.achieved &&
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
      !achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_10)?.achieved &&
      totalBatteryChargeCycles >= 10
    ) {
      achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_10, {
        ...achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_10),
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_100)?.achieved &&
      totalBatteryChargeCycles >= 100
    ) {
      achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_100, {
        ...achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_100),
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_1000)?.achieved &&
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
      !achievements.get(AchievementType.REGION_BADEN_WURTTEMBERG)?.achieved &&
      federalState === 'Baden-Württemberg'
    ) {
      achievements.set(AchievementType.REGION_BADEN_WURTTEMBERG, {
        ...achievements.get(AchievementType.REGION_BADEN_WURTTEMBERG),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_BERLIN)?.achieved &&
      federalState === 'Berlin'
    ) {
      achievements.set(AchievementType.REGION_BERLIN, {
        ...achievements.get(AchievementType.REGION_BERLIN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_BRANDENBURG)?.achieved &&
      federalState === 'Brandenburg'
    ) {
      achievements.set(AchievementType.REGION_BRANDENBURG, {
        ...achievements.get(AchievementType.REGION_BRANDENBURG),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_BREMEN)?.achieved &&
      federalState === 'Bremen'
    ) {
      achievements.set(AchievementType.REGION_BREMEN, {
        ...achievements.get(AchievementType.REGION_BREMEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_HAMBURG)?.achieved &&
      federalState === 'Hamburg'
    ) {
      achievements.set(AchievementType.REGION_HAMBURG, {
        ...achievements.get(AchievementType.REGION_HAMBURG),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_HESSEN)?.achieved &&
      federalState === 'Hessen'
    ) {
      achievements.set(AchievementType.REGION_HESSEN, {
        ...achievements.get(AchievementType.REGION_HESSEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_MECKLENBURG_VORPOMMERN)
        ?.achieved &&
      federalState === 'Mecklenburg-Vorpommern'
    ) {
      achievements.set(AchievementType.REGION_MECKLENBURG_VORPOMMERN, {
        ...achievements.get(AchievementType.REGION_MECKLENBURG_VORPOMMERN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_NIEDERSACHSEN)?.achieved &&
      federalState === 'Niedersachsen'
    ) {
      achievements.set(AchievementType.REGION_NIEDERSACHSEN, {
        ...achievements.get(AchievementType.REGION_NIEDERSACHSEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_NORDRHEIN_WESTFALEN)?.achieved &&
      federalState === 'Nordrhein-Westfalen'
    ) {
      achievements.set(AchievementType.REGION_NORDRHEIN_WESTFALEN, {
        ...achievements.get(AchievementType.REGION_NORDRHEIN_WESTFALEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_RHEINLAND_PFALZ)?.achieved &&
      federalState === 'Rheinland-Pfalz'
    ) {
      achievements.set(AchievementType.REGION_RHEINLAND_PFALZ, {
        ...achievements.get(AchievementType.REGION_RHEINLAND_PFALZ),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SAARLAND)?.achieved &&
      federalState === 'Saarland'
    ) {
      achievements.set(AchievementType.REGION_SAARLAND, {
        ...achievements.get(AchievementType.REGION_SAARLAND),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SACHSEN_ANHALT)?.achieved &&
      federalState === 'Sachsen-Anhalt'
    ) {
      achievements.set(AchievementType.REGION_SACHSEN_ANHALT, {
        ...achievements.get(AchievementType.REGION_SACHSEN_ANHALT),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SACHSEN)?.achieved &&
      federalState === 'Sachsen'
    ) {
      achievements.set(AchievementType.REGION_SACHSEN, {
        ...achievements.get(AchievementType.REGION_SACHSEN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_SCHLESWIG_HOLSTEIN)?.achieved &&
      federalState === 'Schleswig-Holstein'
    ) {
      achievements.set(AchievementType.REGION_SCHLESWIG_HOLSTEIN, {
        ...achievements.get(AchievementType.REGION_SCHLESWIG_HOLSTEIN),
        date: date,
        achieved: true,
      });
    }

    if (
      !achievements.get(AchievementType.REGION_THURINGEN)?.achieved &&
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

  /**
   * Evaluates achievements related to time periods
   * @param achievements achievements
   * @param date date
   */
  evaluateTimePeriods(
    achievements: Map<number, Map<string, Achievement>>,
    date: string,
  ) {
    const year = new Date(date).getFullYear();
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const achievementType = `TIME_PERIOD_ACTIVE_${year}_${month}`;

    if (
      achievements.has(year) &&
      achievements.get(year)?.has(achievementType) &&
      !achievements.get(year)?.get(achievementType)?.achieved
    ) {
      achievements.get(year)?.set(achievementType, {
        ...achievements.get(year)?.get(achievementType),
        achieved: true,
      });
    }

    return new Map(achievements);
  }

  //
  // Helpers
  //

  convertToMap(achievements: Achievement[]): Map<AchievementType, Achievement> {
    return new Map(
      achievements.map((item) => {
        const { type, ...rest } = item;
        return [type as AchievementType, rest as Achievement];
      }),
    );
  }

  /**
   * Generates a list of months between a start and an end date
   * @param startDate start date
   * @param endDate end date
   */
  getTimePeriods(startDate: Date | null, endDate: Date): TimePeriod[] {
    if (!startDate) {
      return [];
    }

    const result: TimePeriod[] = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;

      result.push({ year, month });
      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }
}
