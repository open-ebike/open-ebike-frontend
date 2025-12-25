import { inject, Injectable } from '@angular/core';
import { ActivityRecordsService } from '../../api/bes3/activity-records.service';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom } from 'rxjs';
import { EbikeRegistrationService } from '../../api/bes3/ebike-registration.service';
import { EbikeProfileService } from '../../api/bes3/ebike-profile.service';

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

/**
 * Handles achievements
 */
@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  //
  // Injections
  //

  /** Activity records service */
  private activityRecordsService = inject(ActivityRecordsService);
  /** eBike profile service */
  private ebikeProfileService = inject(EbikeProfileService);
  /** Region finder service */
  private regionFinderService = inject(RegionFinderService);
  /** Registration service */
  private registrationService = inject(EbikeRegistrationService);

  /** Achievements and their date of achieval */
  achievements = new Map<AchievementType, Achievement>([
    [
      AchievementType.ACTIVITIES_1,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.activities-1',
      },
    ],
    [
      AchievementType.ACTIVITIES_10,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.activities-10',
      },
    ],
    [
      AchievementType.DISTANCE_10KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance-10km',
      },
    ],
    [
      AchievementType.DISTANCE_100KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance-100km',
      },
    ],
    [
      AchievementType.DISTANCE_1000KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance-1000km',
      },
    ],
    [
      AchievementType.DISTANCE_3300KM,
      {
        icon: 'assets/achievements/spain-flag.png',
        translation: 'terms.distance-3300km',
      },
    ],
    [
      AchievementType.DISTANCE_3500KM,
      {
        icon: 'assets/achievements/france-flag.png',
        translation: 'terms.distance-3500km',
      },
    ],
    [
      AchievementType.DISTANCE_40075KM,
      {
        icon: 'assets/achievements/earth.png',
        translation: 'terms.distance-40075km',
      },
    ],
    [
      AchievementType.ELEVATION_GAIN_4806M,
      {
        icon: 'assets/achievements/mountains.png',
        translation: 'terms.elevation-gain-4806m',
      },
    ],
    [
      AchievementType.ELEVATION_GAIN_8848_M,
      {
        icon: 'assets/achievements/mountains.png',
        translation: 'terms.elevation-gain-8848m',
      },
    ],
    [
      AchievementType.REGION_BADEN_WURTTEMBERG,
      {
        icon: 'assets/achievements/region/baden-wurttemberg.png',
        translation: 'terms.region-baden-wurttemberg',
      },
    ],
    [
      AchievementType.REGION_BAYERN,
      {
        icon: 'assets/achievements/region/bayern.png',
        translation: 'terms.region-bayern',
      },
    ],
    [
      AchievementType.REGION_BERLIN,
      {
        icon: 'assets/achievements/region/berlin.png',
        translation: 'terms.region-berlin',
      },
    ],
    [
      AchievementType.REGION_BRANDENBURG,
      {
        icon: 'assets/achievements/region/brandenburg.png',
        translation: 'terms.region-berlin',
      },
    ],
    [
      AchievementType.REGION_BREMEN,
      {
        icon: 'assets/achievements/region/bremen.png',
        translation: 'terms.region-bremen',
      },
    ],
    [
      AchievementType.REGION_HAMBURG,
      {
        icon: 'assets/achievements/region/hamburg.png',
        translation: 'terms.region-hamburg',
      },
    ],
    [
      AchievementType.REGION_HESSEN,
      {
        icon: 'assets/achievements/region/hessen.png',
        translation: 'terms.region-hessen',
      },
    ],
    [
      AchievementType.REGION_MECKLENBURG_VORPOMMERN,
      {
        icon: 'assets/achievements/region/mecklenburg-vorpommern.png',
        translation: 'terms.region-mecklenburg-vorpommern',
      },
    ],
    [
      AchievementType.REGION_NIEDERSACHSEN,
      {
        icon: 'assets/achievements/region/niedersachsen.png',
        translation: 'terms.region-niedersachsen',
      },
    ],
    [
      AchievementType.REGION_NORDRHEIN_WESTFALEN,
      {
        icon: 'assets/achievements/region/nordrhein-westfalen.png',
        translation: 'terms.nordrhein-westfalen',
      },
    ],
    [
      AchievementType.REGION_RHEINLAND_PFALZ,
      {
        icon: 'assets/achievements/region/rheinland-pfalz.png',
        translation: 'terms.rheinland-pfalz',
      },
    ],
    [
      AchievementType.REGION_SAARLAND,
      {
        icon: 'assets/achievements/region/saarland.png',
        translation: 'terms.saarland',
      },
    ],
    [
      AchievementType.REGION_SACHSEN,
      {
        icon: 'assets/achievements/region/sachsen.png',
        translation: 'terms.sachsen',
      },
    ],
    [
      AchievementType.REGION_SACHSEN_ANHALT,
      {
        icon: 'assets/achievements/region/sachsen-anhalt.png',
        translation: 'terms.sachsen-anhalt',
      },
    ],
    [
      AchievementType.REGION_SCHLESWIG_HOLSTEIN,
      {
        icon: 'assets/achievements/region/schleswig-holstein.png',
        translation: 'terms.schleswig-holstein',
      },
    ],
    [
      AchievementType.REGION_THURINGEN,
      {
        icon: 'assets/achievements/region/thuringen.png',
        translation: 'terms.thuringen',
      },
    ],
    [
      AchievementType.REGISTRATION_BIKE,
      {
        icon: 'assets/achievements/form.png',
        translation: 'terms.registration-ebike',
      },
    ],
    [
      AchievementType.REGISTRATION_COMPONENT,
      {
        icon: 'assets/achievements/form.png',
        translation: 'terms.registration-component',
      },
    ],
    [
      AchievementType.BATTERY_CHARGE_CYCLES_10,
      {
        icon: 'assets/achievements/eco-battery.png',
        translation: 'terms.battery-charge-cycles-10',
      },
    ],
    [
      AchievementType.BATTERY_CHARGE_CYCLES_100,
      {
        icon: 'assets/achievements/eco-battery.png',
        translation: 'terms.battery-charge-cycles-100',
      },
    ],
    [
      AchievementType.BATTERY_CHARGE_CYCLES_1000,
      {
        icon: 'assets/achievements/eco-battery.png',
        translation: 'terms.battery-charge-cycles-1000',
      },
    ],
  ]);

  /**
   * Constructor
   */
  constructor() {
    this.initialize();
  }

  //
  // Helpers
  //

  /** Battery charge cycles */
  totalBatteryChargeCycles = 0;

  /** Total activity count */
  totalActivityCount = 0;
  /** Total distance */
  totalDistance = 0;
  /** Total elevation gain */
  totalElevationGain = 0;

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async initialize() {
    this.ebikeProfileService.getAllBikes().subscribe(async (bikes) => {
      for (const bike of bikes.bikes) {
        const bikeProfile = await firstValueFrom(
          this.ebikeProfileService.getBike(bike.id),
        );
        bikeProfile.batteries.forEach((battery) => {
          this.totalBatteryChargeCycles += battery.chargeCycles.total;
        });
      }

      if (
        !this.achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_10)
          ?.date &&
        this.totalBatteryChargeCycles >= 10
      ) {
        this.achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_10, {
          ...this.achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_10),
          achieved: true,
        });
      }

      if (
        !this.achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_100)
          ?.date &&
        this.totalBatteryChargeCycles >= 100
      ) {
        this.achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_100, {
          ...this.achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_100),
          achieved: true,
        });
      }

      if (
        !this.achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_1000)
          ?.date &&
        this.totalBatteryChargeCycles >= 1000
      ) {
        this.achievements.set(AchievementType.BATTERY_CHARGE_CYCLES_1000, {
          ...this.achievements.get(AchievementType.BATTERY_CHARGE_CYCLES_1000),
          achieved: true,
        });
      }

      console.log(
        `DEBUG totalBatteryChargeCycles ${this.totalBatteryChargeCycles}`,
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

          this.totalActivityCount += 1;
          this.totalDistance += activitySummary.distance;
          this.totalElevationGain += activitySummary.elevation.gain;

          if (
            !this.achievements.get(AchievementType.ACTIVITIES_1)?.date &&
            this.totalActivityCount >= 1
          ) {
            this.achievements.set(AchievementType.ACTIVITIES_1, {
              ...this.achievements.get(AchievementType.ACTIVITIES_1),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.ACTIVITIES_10)?.date &&
            this.totalActivityCount >= 10
          ) {
            this.achievements.set(AchievementType.ACTIVITIES_10, {
              ...this.achievements.get(AchievementType.ACTIVITIES_10),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_10KM)?.date &&
            this.totalDistance >= 10_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_10KM, {
              ...this.achievements.get(AchievementType.DISTANCE_10KM),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_100KM)?.date &&
            this.totalDistance >= 100_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_100KM, {
              ...this.achievements.get(AchievementType.DISTANCE_100KM),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_1000KM)?.date &&
            this.totalDistance >= 1_000_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_1000KM, {
              ...this.achievements.get(AchievementType.DISTANCE_1000KM),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_3500KM)?.date &&
            this.totalDistance >= 3_500_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_3500KM, {
              ...this.achievements.get(AchievementType.DISTANCE_3500KM),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_3300KM)?.date &&
            this.totalDistance >= 3_300_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_3300KM, {
              ...this.achievements.get(AchievementType.DISTANCE_3300KM),
              date: activitySummary.startTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_40075KM)?.date &&
            this.totalDistance >= 40_075_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_40075KM, {
              ...this.achievements.get(AchievementType.DISTANCE_40075KM),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.ELEVATION_GAIN_4806M)
              ?.date &&
            this.totalElevationGain >= 4806
          ) {
            this.achievements.set(AchievementType.ELEVATION_GAIN_4806M, {
              ...this.achievements.get(AchievementType.ELEVATION_GAIN_4806M),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.ELEVATION_GAIN_8848_M)
              ?.date &&
            this.totalElevationGain >= 8848
          ) {
            this.achievements.set(AchievementType.ELEVATION_GAIN_8848_M, {
              ...this.achievements.get(AchievementType.ELEVATION_GAIN_8848_M),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_BADEN_WURTTEMBERG)
              ?.date &&
            federalState === 'Baden-Württemberg'
          ) {
            this.achievements.set(AchievementType.REGION_BADEN_WURTTEMBERG, {
              ...this.achievements.get(
                AchievementType.REGION_BADEN_WURTTEMBERG,
              ),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_BERLIN)?.date &&
            federalState === 'Berlin'
          ) {
            this.achievements.set(AchievementType.REGION_BERLIN, {
              ...this.achievements.get(AchievementType.REGION_BERLIN),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_BRANDENBURG)?.date &&
            federalState === 'Brandenburg'
          ) {
            this.achievements.set(AchievementType.REGION_BRANDENBURG, {
              ...this.achievements.get(AchievementType.REGION_BRANDENBURG),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_BREMEN)?.date &&
            federalState === 'Bremen'
          ) {
            this.achievements.set(AchievementType.REGION_BREMEN, {
              ...this.achievements.get(AchievementType.REGION_BREMEN),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_HAMBURG)?.date &&
            federalState === 'Hamburg'
          ) {
            this.achievements.set(AchievementType.REGION_HAMBURG, {
              ...this.achievements.get(AchievementType.REGION_HAMBURG),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_HESSEN)?.date &&
            federalState === 'Hessen'
          ) {
            this.achievements.set(AchievementType.REGION_HESSEN, {
              ...this.achievements.get(AchievementType.REGION_HESSEN),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(
              AchievementType.REGION_MECKLENBURG_VORPOMMERN,
            )?.date &&
            federalState === 'Mecklenburg-Vorpommern'
          ) {
            this.achievements.set(
              AchievementType.REGION_MECKLENBURG_VORPOMMERN,
              {
                ...this.achievements.get(
                  AchievementType.REGION_MECKLENBURG_VORPOMMERN,
                ),
                date: activitySummary.startTime,
                achieved: true,
              },
            );
          }

          if (
            !this.achievements.get(AchievementType.REGION_NIEDERSACHSEN)
              ?.date &&
            federalState === 'Niedersachsen'
          ) {
            this.achievements.set(AchievementType.REGION_NIEDERSACHSEN, {
              ...this.achievements.get(AchievementType.REGION_NIEDERSACHSEN),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_NORDRHEIN_WESTFALEN)
              ?.date &&
            federalState === 'Nordrhein-Westfalen'
          ) {
            this.achievements.set(AchievementType.REGION_NORDRHEIN_WESTFALEN, {
              ...this.achievements.get(
                AchievementType.REGION_NORDRHEIN_WESTFALEN,
              ),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_RHEINLAND_PFALZ)
              ?.date &&
            federalState === 'Rheinland-Pfalz'
          ) {
            this.achievements.set(AchievementType.REGION_RHEINLAND_PFALZ, {
              ...this.achievements.get(AchievementType.REGION_RHEINLAND_PFALZ),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_SAARLAND)?.date &&
            federalState === 'Saarland'
          ) {
            this.achievements.set(AchievementType.REGION_SAARLAND, {
              ...this.achievements.get(AchievementType.REGION_SAARLAND),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_SACHSEN_ANHALT)
              ?.date &&
            federalState === 'Sachsen-Anhalt'
          ) {
            this.achievements.set(AchievementType.REGION_SACHSEN_ANHALT, {
              ...this.achievements.get(AchievementType.REGION_SACHSEN_ANHALT),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_SACHSEN)?.date &&
            federalState === 'Sachsen'
          ) {
            this.achievements.set(AchievementType.REGION_SACHSEN, {
              ...this.achievements.get(AchievementType.REGION_SACHSEN),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_SCHLESWIG_HOLSTEIN)
              ?.date &&
            federalState === 'Schleswig-Holstein'
          ) {
            this.achievements.set(AchievementType.REGION_SCHLESWIG_HOLSTEIN, {
              ...this.achievements.get(
                AchievementType.REGION_SCHLESWIG_HOLSTEIN,
              ),
              date: activitySummary.startTime,
              achieved: true,
            });
          }

          if (
            !this.achievements.get(AchievementType.REGION_THURINGEN)?.date &&
            federalState === 'Thüringen'
          ) {
            this.achievements.set(AchievementType.REGION_THURINGEN, {
              ...this.achievements.get(AchievementType.REGION_THURINGEN),
              date: activitySummary.startTime,
              achieved: true,
            });
          }
        }
      });

    this.registrationService.getRegistrations().subscribe((registrations) => {
      for (let registration of registrations.registrations) {
        if (
          !this.achievements.get(AchievementType.REGISTRATION_BIKE)?.date &&
          registration.bikeRegistration
        ) {
          this.achievements.set(AchievementType.REGISTRATION_BIKE, {
            ...this.achievements.get(AchievementType.REGISTRATION_BIKE),
            date: registration.createdAt,
            achieved: true,
          });
        }

        if (
          !this.achievements.get(AchievementType.REGISTRATION_COMPONENT)
            ?.date &&
          registration.componentRegistration
        ) {
          this.achievements.set(AchievementType.REGISTRATION_COMPONENT, {
            ...this.achievements.get(AchievementType.REGISTRATION_COMPONENT),
            date: registration.createdAt,
            achieved: true,
          });
        }
      }
    });
  }
}
