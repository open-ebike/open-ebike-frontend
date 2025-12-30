import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivityRecordsService } from '../../api/bes3/activity-records.service';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom, map } from 'rxjs';
import { EbikeRegistrationService } from '../../api/bes3/ebike-registration.service';
import { EbikeProfileService } from '../../api/bes3/ebike-profile.service';
import { Achievement, AchievementService } from '../achievement.service';
import {
  achievements,
  AchievementType,
} from '../../../../environments/achievements';
import { BikePassService } from '../../api/bes3/bike-pass.service';

/**
 * Handles achievements
 */
@Injectable({
  providedIn: 'root',
})
export class Bes3AchievementService {
  //
  // Injections
  //

  /** Achievement service*/
  private achievementService = inject(AchievementService);
  /** Activity records service */
  private activityRecordsService = inject(ActivityRecordsService);
  /** eBike profile service */
  private ebikeProfileService = inject(EbikeProfileService);
  /** Region finder service */
  private regionFinderService = inject(RegionFinderService);
  /** Registration service */
  private registrationService = inject(EbikeRegistrationService);
  /** Bike pass service */
  private bikePassService = inject(BikePassService);

  //
  // Achievements
  //

  /** Achievements */
  achievementsActivities = signal(
    this.achievementService.convertToMap(achievements.activities),
  );
  /** Achievements */
  achievementsDistances = signal(
    this.achievementService.convertToMap(achievements.distances),
  );
  /** Achievements */
  achievementsElevationGain = signal(
    this.achievementService.convertToMap(achievements.elevationGain),
  );
  /** Achievements */
  achievementsRegistrations = signal(
    this.achievementService.convertToMap(achievements.registrations),
  );
  /** Achievements */
  achievementsBikePasses = signal(
    this.achievementService.convertToMap(achievements.bikePasses),
  );
  /** Achievements */
  achievementsBatteryChargeCycles = signal(
    this.achievementService.convertToMap(achievements.batteryChargeCycles),
  );
  /** Achievements */
  achievementsRegions = signal(
    this.achievementService.convertToMap(achievements.regions),
  );
  /** Achievements */
  achievementsTimePeriods = signal(new Map<number, Map<string, Achievement>>());

  /** Achievements */
  achievementsBasic = computed(() => {
    return new Map<AchievementType, Achievement>([
      ...this.achievementsActivities(),
      ...this.achievementsDistances(),
      ...this.achievementsElevationGain(),
      ...this.achievementsRegistrations(),
      ...this.achievementsBikePasses(),
      ...this.achievementsBatteryChargeCycles(),
    ]);
  });

  /**
   * Constructor
   */
  constructor() {
    this.activityRecordsService
      .getAllActivitySummaries(1, 0, 'startTime')
      .pipe(
        map((activitySummaries) => {
          return activitySummaries.activitySummaries.length > 0
            ? new Date(activitySummaries.activitySummaries[0].startTime)
            : new Date();
        }),
      )
      .subscribe((firstActivityDate) => {
        this.initialize(firstActivityDate);
        this.evaluate();
      });
  }

  //
  // Initialization
  //

  async initialize(firstActivityDate: Date) {
    const achievementsTimePeriods =
      this.achievementService.initializeAchievementsTimePeriods(
        firstActivityDate,
      );
    this.achievementsTimePeriods.set(achievementsTimePeriods);
  }

  /**
   * Loads bikes, activities, registrations and evaluates if achievements have been reached
   */
  private async evaluate() {
    /** Battery charge cycles */
    let totalBatteryChargeCycles = 0;

    /** Total activity count */
    let totalActivityCount = 0;
    /** Total distance */
    let totalDistance = 0;
    /** Total elevation gain */
    let totalElevationGain = 0;

    this.ebikeProfileService.getAllBikes().subscribe(async (bikes) => {
      for (const bike of bikes.bikes) {
        const bikeProfile = await firstValueFrom(
          this.ebikeProfileService.getBike(bike.id),
        );
        bikeProfile.batteries.forEach((battery) => {
          totalBatteryChargeCycles += battery.chargeCycles.total;
        });

        this.bikePassService.getBikePasses(bike.id).subscribe((bikePasses) => {
          for (let bikePass of bikePasses.bikePasses) {
            this.achievementsBikePasses.set(
              this.achievementService.evaluateBikePasses(
                this.achievementsBikePasses(),
                bikePass,
              ),
            );
          }
        });
      }

      const achievementsBatteryChargeCycles =
        this.achievementService.evaluateBatteryChargeCycles(
          this.achievementsBatteryChargeCycles(),
          totalBatteryChargeCycles,
        );
      this.achievementsBatteryChargeCycles.set(achievementsBatteryChargeCycles);
    });

    this.activityRecordsService
      .getAllActivitySummariesRecursively(100, 'startTime')
      .subscribe(async (activitySummaries) => {
        for (let activitySummary of activitySummaries) {
          const activityDetails = await firstValueFrom(
            this.activityRecordsService.getActivityDetails(activitySummary.id),
          );
          const firstActivityDetail = activityDetails.activityDetails.find(
            (detail) => {
              return detail.latitude != 0.0 && detail.longitude != 0.0;
            },
          );
          const lat = firstActivityDetail?.latitude;
          const lon = firstActivityDetail?.longitude;
          const federalState =
            lat != null && lon != null
              ? this.regionFinderService.getFederalState(lat, lon)
              : null;

          totalActivityCount += 1;
          totalDistance += activitySummary.distance;
          totalElevationGain += activitySummary.elevation.gain;

          this.achievementsActivities.set(
            this.achievementService.evaluateActivities(
              this.achievementsActivities(),
              totalActivityCount,
              activitySummary.startTime,
            ),
          );

          this.achievementsDistances.set(
            this.achievementService.evaluateDistances(
              this.achievementsDistances(),
              totalDistance,
              activitySummary.startTime,
            ),
          );

          this.achievementsElevationGain.set(
            this.achievementService.evaluateElevationGain(
              this.achievementsElevationGain(),
              totalElevationGain,
              activitySummary.startTime,
            ),
          );

          this.achievementsRegions.set(
            this.achievementService.evaluateRegions(
              this.achievementsRegions(),
              federalState ?? '',
              activitySummary.startTime,
            ),
          );

          this.achievementsTimePeriods.set(
            this.achievementService.evaluateTimePeriods(
              this.achievementsTimePeriods(),
              activitySummary.startTime,
            ),
          );
        }
      });

    this.registrationService.getRegistrations().subscribe((registrations) => {
      for (let registration of registrations.registrations) {
        this.achievementsRegistrations.set(
          this.achievementService.evaluateRegistration(
            this.achievementsRegistrations(),
            registration,
          ),
        );
      }
    });
  }
}
