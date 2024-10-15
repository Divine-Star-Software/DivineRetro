import type { DivineStar } from "../DivineStar";

export class AudioManager {
  constructor(public DS: DivineStar) {}

  async playSong(songId: string, loop: boolean = false) {}

  async playSFX(sfxId: string, loop: boolean = false) {}
}
