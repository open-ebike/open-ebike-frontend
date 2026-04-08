import { Injectable, signal } from '@angular/core';
import Dexie, { liveQuery, Table } from 'dexie';
import { from, Observable } from 'rxjs';
import { ActivityDetails } from '../api/bes3/activity-records.service';

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** ID */
  id: string;
  /** Recorded blob */
  recording: Blob;
}

/**
 * Represents a database
 */
class Database extends Dexie {
  /** Database items */
  items!: Table<DatabaseItem, string>;

  /**
   * Constructor
   */
  constructor() {
    super('fly-over-recording-database');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
    });
  }
}

/**
 * Handles fly-over recordings
 */
@Injectable({
  providedIn: 'root',
})
export class FlyOverRecordingService {
  //
  // Access
  //

  /**
   * Checks if a fly-over recording exists
   * @param id ID
   */
  existsFlyoverRecording(id: string): Observable<boolean> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.where('id').equals(id).count()) > 0;
      }),
    );
  }

  /**
   * Retrieves fly-over recording
   * @param id ID
   */
  getFlyOverRecording(id: string): Observable<Blob> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.get(id))?.recording as Blob;
      }),
    );
  }

  //
  // Cache
  //

  /** Database */
  private database = new Database();
  /** Loading state */
  loading = signal<boolean>(false);
  /** Loaded state */
  loaded = signal<boolean>(false);

  async store(id: string, recording: Blob) {
    this.loading.set(true);

    try {
      this.loading.set(true);

      // Save items to database
      const itemToSave: DatabaseItem = {
        id: id,
        recording: recording,
      };
      await this.database.items.put(itemToSave);
      this.loading.set(false);
      this.loaded.set(true);
      return true;
    } catch {
      this.loading.set(false);
      return false;
    }
  }
}
