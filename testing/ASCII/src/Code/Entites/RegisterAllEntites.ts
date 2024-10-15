import type { DivineStar } from "../DivineStar";
import { EnergyFlyEntity } from "./Types/PassiveCreatures/EnergyFly.entity";
import { FearCrystalSpawner } from "./Types/FearCrystals/FearCrystalSpawner.entity";
import { FearCrystalWanderEntity } from "./Types/FearCrystals/FearCrystalWander.entity";
import { ParticleSpawnerEntity } from "./Types/Particles/ParticleSpawner.entity";
import { RandomText } from "./Types/Text/RandomText";
import { MelEyesEntity } from "./Types/Decor/MelEyes.entity";
import { MelStatsEntity } from "./Types/DataDisplay/MelStats.entity";
import { WorldDataDisplayEntity } from "./Types/DataDisplay/WorldDataDisplay.entity";
import { FearFormEntity } from "./Types/FearForms/FearFormEntity";
import { BattleCursorEntity } from "./Types/Battles/BattleCursorEntity";

declare const DS : DivineStar;
export async function RegisterAllEntites() {
    DS.entityManager.registerEntity("FearCrystalWanderEntity",FearCrystalWanderEntity);
    DS.entityManager.registerEntity("FearCrystalSpawner",FearCrystalSpawner);
    DS.entityManager.registerEntity("EnergyFlyEntity",EnergyFlyEntity);
    DS.entityManager.registerEntity("ParticleSpawnerEntity",ParticleSpawnerEntity);
    DS.entityManager.registerEntity("RandomText",RandomText);
    DS.entityManager.registerEntity("MelEyesEntity",MelEyesEntity);
    DS.entityManager.registerEntity("MelStatsEntity",MelStatsEntity);
    DS.entityManager.registerEntity("WorldDataDisplayEntity",WorldDataDisplayEntity);
    DS.entityManager.registerEntity("FearFormEntity",FearFormEntity);
    DS.entityManager.registerEntity("BattleCursorEntity",BattleCursorEntity);
}