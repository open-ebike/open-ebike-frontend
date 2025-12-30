/**
 * Types of yearly achievements
 */
export enum YearlyAchievementType {
  TOTAL_ACTIVITY_COUNT = 'TOTAL_ACTIVITY_COUNT',
  TOTAL_DISTANCE = 'TOTAL_DISTANCE',
  TOTAL_DURATION = 'TOTAL_DURATION',
  TOTAL_ELEVATION_GAIN = 'TOTAL_ELEVATION_GAIN',
  TOTAL_CALORIES_BURNED = 'TOTAL_CALORIES_BURNED',
  MAX_ALTITUDE = 'MAX_ALTITUDE',
}

export const yearlyAchievements = {
  general: [
    {
      type: YearlyAchievementType.TOTAL_ACTIVITY_COUNT,
      icon: 'assets/achievements/mobile.png',
      translationSharePicture: 'terms.share-pictures.total-activity-count',
    },
    {
      type: YearlyAchievementType.TOTAL_DISTANCE,
      icon: 'assets/achievements/pathway.png',
      translationSharePicture: 'terms.share-pictures.total-distance',
    },
    {
      type: YearlyAchievementType.TOTAL_DURATION,
      icon: 'assets/achievements/settings.png',
      translationSharePicture: 'terms.share-pictures.total-duration',
    },
    {
      type: YearlyAchievementType.TOTAL_ELEVATION_GAIN,
      icon: 'assets/achievements/bicycle.png',
      translationSharePicture: 'terms.share-pictures.total-elevation-gain',
    },
    {
      type: YearlyAchievementType.TOTAL_CALORIES_BURNED,
      icon: 'assets/achievements/burn.png',
      translationSharePicture: 'terms.share-pictures.total-calories-burned',
    },
    {
      type: YearlyAchievementType.MAX_ALTITUDE,
      icon: 'assets/achievements/success.png',
      translationSharePicture: 'terms.share-pictures.max-altitude',
    },
  ],
};
