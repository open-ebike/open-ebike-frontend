import { inject, Injectable } from '@angular/core';
import { ActivityRecordsService } from '../../api/bes3/activity-records.service';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom } from 'rxjs';
import { EbikeRegistrationService } from '../../api/bes3/ebike-registration.service';
import { EbikeProfileService } from '../../api/bes3/ebike-profile.service';
import { AchievementService } from '../achievement.service';

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

  //
  // Achievements
  //

  /** Achievements and their date of achieval */
  achievementsActivities = new Map(
    this.achievementService.achievementsActivities,
  );
  /** Achievements and their date of achieval */
  achievementsDistances = new Map(
    this.achievementService.achievementsDistances,
  );
  /** Achievements and their date of achieval */
  achievementsElevationGain = new Map(
    this.achievementService.achievementsElevationGain,
  );
  /** Achievements and their date of achieval */
  achievementsRegistrations = new Map(
    this.achievementService.achievementsRegistrations,
  );
  /** Achievements and their date of achieval */
  achievementsBatteryChargeCycles = new Map(
    this.achievementService.achievementsBatteryChargeCycles,
  );
  /** Achievements and their date of achieval */
  achievementsRegions = new Map(this.achievementService.achievementsRegions);

  /**
   * Constructor
   */
  constructor() {
    this.initialize();
  }

  //
  // Initialization
  //

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async initialize() {
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
      }

      this.achievementService.evaluateBatteryChargeCycles(
        this.achievementsBatteryChargeCycles,
        totalBatteryChargeCycles,
      );
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

          this.achievementsActivities =
            this.achievementService.evaluateActivities(
              this.achievementsActivities,
              totalActivityCount,
              activitySummary.startTime,
            );
          this.achievementsDistances =
            this.achievementService.evaluateDistances(
              this.achievementsDistances,
              totalDistance,
              activitySummary.startTime,
            );
          this.achievementsElevationGain =
            this.achievementService.evaluateElevationGain(
              this.achievementsElevationGain,
              totalElevationGain,
              activitySummary.startTime,
            );
          this.achievementsRegions = this.achievementService.evaluateRegions(
            this.achievementsRegions,
            federalState ?? '',
            activitySummary.startTime,
          );
        }
      });

    this.registrationService.getRegistrations().subscribe((registrations) => {
      for (let registration of registrations.registrations) {
        this.achievementsRegistrations =
          this.achievementService.evaluateRegistration(
            this.achievementsRegistrations,
            registration,
          );
      }
    });
  }
}
