import { Injectable } from '@angular/core';
import {
  yearlyAchievements,
  YearlyAchievementType,
} from '../../../environments/yearly-achievements';

/**
 * Represents a yearly time period
 */
export interface YearlyTimePeriod {
  /** Year */
  year: number;
}

/**
 * Represents yearly achievements
 */
export interface YearlyAchievement {
  /** Type */
  type?: YearlyAchievementType | string;
  /** Icon */
  icon?: string;
  /** Translation */
  translationSharePicture?: string;
  /** Translation context */
  translationContext?: {};
  /** Value */
  value?: number;
}

/**
 * Handles yearly achievements
 */
@Injectable({
  providedIn: 'root',
})
export class YearlyAchievementService {
  //
  // Initialization
  //

  /**
   * Dynamically initializes yearly achievements based on time periods
   * @param firstActivityDate date of first activity
   */
  initializeYearlyAchievements(
    firstActivityDate: Date | null,
  ): Map<number, Map<YearlyAchievementType, YearlyAchievement>> {
    const achievementsTimePeriods = new Map<
      number,
      Map<YearlyAchievementType, YearlyAchievement>
    >();
    this.getTimeYearlyPeriods(firstActivityDate, new Date()).forEach(
      (timePeriod) => {
        achievementsTimePeriods.set(
          timePeriod.year,
          this.convertToMap(yearlyAchievements.general),
        );
      },
    );

    return achievementsTimePeriods;
  }

  //
  // Helpers
  //

  convertToMap(
    yearlyAchievements: YearlyAchievement[],
  ): Map<YearlyAchievementType, YearlyAchievement> {
    return new Map(
      yearlyAchievements.map((item) => {
        const { type, ...rest } = item;
        return [type as YearlyAchievementType, rest as YearlyAchievement];
      }),
    );
  }

  /**
   * Generates a list of years between a start and an end date
   * @param startDate start date
   * @param endDate end date
   */
  getTimeYearlyPeriods(
    startDate: Date | null,
    endDate: Date,
  ): YearlyTimePeriod[] {
    if (!startDate) {
      return [];
    }

    const result: YearlyTimePeriod[] = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();

      result.push({ year });
      current.setFullYear(current.getFullYear() + 1);
    }

    return result;
  }
}
