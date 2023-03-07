import { NextPage } from "next";
import { DpsChart } from "../components/unitStats/dpsChart";
import { EbpsType, getEbpsStats, setEbpsStats } from "../src/unitStats/mappingEbps";
import { getSbpsStats, SbpsType, setSbpsStats } from "../src/unitStats/mappingSbps";
import {
  getUpgradesStats,
  setUpgradesStats,
  UpgradesType,
} from "../src/unitStats/mappingUpgrades";
import { getWeaponStats, setWeaponStats, WeaponType } from "../src/unitStats/mappingWeapon";

type Locstring = {
  id: number;
  value: string;
};

let unitStatsLocString: Locstring[];

export const resolveLocstring = (locstring: any) => {
  const numId = parseInt(locstring?.locstring?.value);

  let result = unitStatsLocString?.find((entry) => entry.id == numId)?.value;
  if (!result) result = "No text found.";

  return result;
};

interface UnitCardProps {
  weaponData: WeaponType[];
  spbsData: SbpsType[];
  epbsData: EbpsType[];
  upgradesData: UpgradesType[];
  generalInfo: any;
  properties: any;
}

// Parameter in Curly brackets is destructuring for
// accessing attributes of Props Structure directly
const UnitPage: NextPage<UnitCardProps> = ({ weaponData, spbsData, epbsData, upgradesData }) => {
  setWeaponStats(weaponData);
  setEbpsStats(epbsData);
  setUpgradesStats(upgradesData);
  setSbpsStats(spbsData);

  return (
    <div>
      <DpsChart></DpsChart>
    </div>
  );
};

export const getStaticProps = async () => {
  // relative path are not supported as far as I understood
  //const myReq = await fetch("http://localhost:3000/game_stats/weapons.json");
  const myReqWeapon = await fetch(
    "https://raw.githubusercontent.com/cohstats/coh3-data/xml-data/scripts/xml-to-json/exported/weapon.json",
  );

  const myReqSbps = await fetch(
    "https://raw.githubusercontent.com/cohstats/coh3-data/xml-data/scripts/xml-to-json/exported/sbps.json",
  );

  const myReqEbps = await fetch(
    "https://raw.githubusercontent.com/cohstats/coh3-data/xml-data/scripts/xml-to-json/exported/ebps.json",
  );

  const myReqUpgrades = await fetch(
    "https://raw.githubusercontent.com/cohstats/coh3-data/xml-data/scripts/xml-to-json/exported/upgrade.json",
  );

  const myReqLocstring = await fetch(
    "https://raw.githubusercontent.com/cohstats/coh3-data/xml-data/scripts/xml-to-json/exported/locstring.json",
  );

  // Map localization
  const locstringJSON = await myReqLocstring.json();
  unitStatsLocString = [];
  for (const loc in locstringJSON)
    unitStatsLocString.push({ id: parseInt(loc), value: locstringJSON[loc] });

  const weapon = await myReqWeapon.json();
  // map Data at built time
  const weaponData = getWeaponStats(weapon);
  setWeaponStats(weaponData);

  const ebps = await myReqEbps.json();
  // map Data at built time
  const ebpsData = getEbpsStats(ebps);
  setEbpsStats(ebpsData);

  const sbps = await myReqSbps.json();
  // map Data at built time
  const sbpsData = getSbpsStats(sbps);
  setSbpsStats(sbpsData);

  const upgrades = await myReqUpgrades.json();
  // map Data at built time
  const upgradesData = getUpgradesStats(upgrades);
  setUpgradesStats(upgradesData);

  return {
    props: {
      weaponData: weaponData,
      sbpsData: sbpsData,
      ebpsData: ebpsData,
      upgradesData: upgradesData,
    },
  };
};

export default UnitPage;
