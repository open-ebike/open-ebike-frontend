import { AchievementType } from '../app/services/achievement/achievement.service';

export const achievements = {
  activities: [
    {
      type: AchievementType.ACTIVITIES_1,
      icon: 'assets/achievements/medal.png',
      translation: 'terms.badges.activities.1',
      translationSharePicture: 'terms.share-pictures.activities.1',
    },
    {
      type: AchievementType.ACTIVITIES_10,
      icon: 'assets/achievements/medal.png',
      translation: 'terms.badges.activities.10',
      translationSharePicture: 'terms.share-pictures.activities.10',
    },
  ],
  distances: [
    {
      type: AchievementType.DISTANCE_10KM,
      icon: 'assets/achievements/medal-2.png',
      translation: 'terms.badges.distance.10km',
      translationSharePicture: 'terms.share-pictures.distance.10km',
    },
    {
      type: AchievementType.DISTANCE_100KM,
      icon: 'assets/achievements/medal-2.png',
      translation: 'terms.badges.distance.100km',
      translationSharePicture: 'terms.share-pictures.distance.100km',
    },
    {
      type: AchievementType.DISTANCE_1000KM,
      icon: 'assets/achievements/medal-2.png',
      translation: 'terms.badges.distance.1000km',
      translationSharePicture: 'terms.share-pictures.distance.1000km',
    },
    {
      type: AchievementType.DISTANCE_3300KM,
      icon: 'assets/achievements/spain-flag.png',
      translation: 'terms.badges.distance.3300km',
      translationSharePicture: 'terms.share-pictures.distance.3300km',
    },
    {
      type: AchievementType.DISTANCE_3500KM,
      icon: 'assets/achievements/france-flag.png',
      translation: 'terms.badges.distance.3500km',
      translationSharePicture: 'terms.share-pictures.distance.3500km',
    },
    {
      type: AchievementType.DISTANCE_40075KM,
      icon: 'assets/achievements/earth.png',
      translation: 'terms.badges.distance.40075km',
      translationSharePicture: 'terms.share-pictures.distance.40075km',
    },
  ],
  elevationGain: [
    {
      type: AchievementType.ELEVATION_GAIN_4806M,
      icon: 'assets/achievements/mountains.png',
      translation: 'terms.badges.elevation-gain.4806m',
      translationSharePicture: 'terms.share-pictures.elevation-gain.4806m',
    },

    {
      type: AchievementType.ELEVATION_GAIN_8848_M,
      icon: 'assets/achievements/mountains.png',
      translation: 'terms.badges.elevation-gain.8848m',
      translationSharePicture: 'terms.share-pictures.elevation-gain.8848m',
    },
  ],
  registrations: [
    {
      type: AchievementType.REGISTRATION_BIKE,
      icon: 'assets/achievements/form.png',
      translation: 'terms.badges.registration.ebike',
      translationSharePicture: 'terms.share-pictures.registration.ebike',
    },
    {
      type: AchievementType.REGISTRATION_COMPONENT,
      icon: 'assets/achievements/form.png',
      translation: 'terms.badges.registration.component',
      translationSharePicture: 'terms.share-pictures.registration.component',
    },
  ],
  batteryChargeCycles: [
    {
      type: AchievementType.BATTERY_CHARGE_CYCLES_10,
      icon: 'assets/achievements/eco-battery.png',
      translation: 'terms.badges.battery-charge-cycles.10',
      translationSharePicture: 'terms.share-pictures.battery-charge-cycles.10',
    },
    {
      type: AchievementType.BATTERY_CHARGE_CYCLES_100,
      icon: 'assets/achievements/eco-battery.png',
      translation: 'terms.badges.battery-charge-cycles.100',
      translationSharePicture: 'terms.share-pictures.battery-charge-cycles.100',
    },
    {
      type: AchievementType.BATTERY_CHARGE_CYCLES_1000,
      icon: 'assets/achievements/eco-battery.png',
      translation: 'terms.badges.battery-charge-cycles.1000',
      translationSharePicture:
        'terms.share-pictures.battery-charge-cycles.1000',
    },
  ],
  regions: [
    {
      type: AchievementType.REGION_BADEN_WURTTEMBERG,
      icon: 'assets/achievements/regions/baden-wurttemberg.png',
      translation: 'terms.badges.regions.baden-wurttemberg',
      translationSharePicture: 'terms.share-pictures.regions.baden-wurttemberg',
    },
    {
      type: AchievementType.REGION_BAYERN,
      icon: 'assets/achievements/regions/bayern.png',
      translation: 'terms.badges.regions.bayern',
      translationSharePicture: 'terms.share-pictures.regions.bayern',
    },
    {
      type: AchievementType.REGION_BERLIN,
      icon: 'assets/achievements/regions/berlin.png',
      translation: 'terms.badges.regions.berlin',
      translationSharePicture: 'terms.share-pictures.regions.berlin',
    },
    {
      type: AchievementType.REGION_BRANDENBURG,
      icon: 'assets/achievements/regions/brandenburg.png',
      translation: 'terms.badges.regions.berlin',
      translationSharePicture: 'terms.share-pictures.regions.berlin',
    },
    {
      type: AchievementType.REGION_BREMEN,
      icon: 'assets/achievements/regions/bremen.png',
      translation: 'terms.badges.regions.bremen',
      translationSharePicture: 'terms.share-pictures.regions.bremen',
    },
    {
      type: AchievementType.REGION_HAMBURG,
      icon: 'assets/achievements/regions/hamburg.png',
      translation: 'terms.badges.regions.hamburg',
      translationSharePicture: 'terms.share-pictures.regions.hamburg',
    },
    {
      type: AchievementType.REGION_HESSEN,
      icon: 'assets/achievements/regions/hessen.png',
      translation: 'terms.badges.regions.hessen',
      translationSharePicture: 'terms.share-pictures.regions.hessen',
    },
    {
      type: AchievementType.REGION_MECKLENBURG_VORPOMMERN,
      icon: 'assets/achievements/regions/mecklenburg-vorpommern.png',
      translation: 'terms.badges.regions.mecklenburg-vorpommern',
      translationSharePicture:
        'terms.share-pictures.regions.mecklenburg-vorpommern',
    },
    {
      type: AchievementType.REGION_NIEDERSACHSEN,
      icon: 'assets/achievements/regions/niedersachsen.png',
      translation: 'terms.badges.regions.niedersachsen',
      translationSharePicture: 'terms.share-pictures.regions.niedersachsen',
    },
    {
      type: AchievementType.REGION_NORDRHEIN_WESTFALEN,
      icon: 'assets/achievements/regions/nordrhein-westfalen.png',
      translation: 'terms.badges.regions.nordrhein-westfalen',
      translationSharePicture:
        'terms.share-pictures.regions.nordrhein-westfalen',
    },
    {
      type: AchievementType.REGION_RHEINLAND_PFALZ,
      icon: 'assets/achievements/regions/rheinland-pfalz.png',
      translation: 'terms.badges.regions.rheinland-pfalz',
      translationSharePicture: 'terms.share-pictures.regions.rheinland-pfalz',
    },
    {
      type: AchievementType.REGION_SAARLAND,
      icon: 'assets/achievements/regions/saarland.png',
      translation: 'terms.badges.regions.saarland',
      translationSharePicture: 'terms.share-pictures.regions.saarland',
    },
    {
      type: AchievementType.REGION_SACHSEN,
      icon: 'assets/achievements/regions/sachsen.png',
      translation: 'terms.badges.regions.sachsen',
      translationSharePicture: 'terms.share-pictures.regions.sachsen',
    },
    {
      type: AchievementType.REGION_SACHSEN_ANHALT,
      icon: 'assets/achievements/regions/sachsen-anhalt.png',
      translation: 'terms.badges.regions.sachsen-anhalt',
      translationSharePicture: 'terms.share-pictures.regions.sachsen-anhalt',
    },
    {
      type: AchievementType.REGION_SCHLESWIG_HOLSTEIN,
      icon: 'assets/achievements/regions/schleswig-holstein.png',
      translation: 'terms.badges.regions.schleswig-holstein',
      translationSharePicture:
        'terms.share-pictures.regions.schleswig-holstein',
    },
    {
      type: AchievementType.REGION_THURINGEN,
      icon: 'assets/achievements/regions/thuringen.png',
      translation: 'terms.badges.regions.thuringen',
      translationSharePicture: 'terms.share-pictures.regions.thuringen',
    },
  ],
};
