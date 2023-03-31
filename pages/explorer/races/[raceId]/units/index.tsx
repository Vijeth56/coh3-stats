import { GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconBarrierBlock } from "@tabler/icons";
import { Anchor, Card, Flex, Grid, Stack, Text, Title } from "@mantine/core";

import ContentContainer from "../../../../../components/Content-container";
import { raceType } from "../../../../../src/coh3/coh3-types";
import { generateKeywordsString } from "../../../../../src/head-utils";
import { localizedNames } from "../../../../../src/coh3/coh3-data";
import { getMappings } from "../../../../../src/unitStats/mappings";
import { RaceBagDescription, SbpsType } from "../../../../../src/unitStats";
import FactionIcon from "../../../../../components/faction-icon";
import { UnitDescriptionCard } from "../../../../../components/unit-cards/unit-description-card";

interface UnitDetailProps {
  sbpsData: SbpsType[];
  locstring: Record<string, string>;
}

const ExplorerUnits: NextPage<UnitDetailProps> = ({ sbpsData }) => {
  const { query } = useRouter();

  const raceToFetch = (query.raceId as raceType) || "american";
  const localizedRace = localizedNames[raceToFetch];

  const metaKeywords = generateKeywordsString([
    `${localizedRace} coh3`,
    `Unit List ${localizedRace}`,
  ]);

  const faction = raceToFetch === "dak" ? "afrika_korps" : raceToFetch;
  const units = sbpsData.filter((squad) => squad.faction.includes(faction));

  return (
    <>
      <Head>
        <title>{`${localizedRace} Units - COH3 Explorer`}</title>
        <meta name="description" content={`${localizedRace} Units - COH3 Explorer`} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:image" content={`/icons/general/${raceToFetch}.webp`} />
      </Head>
      <ContentContainer>
        <Stack>
          <Flex direction="row" align="center" gap="md">
            <FactionIcon name={raceToFetch} width={64} />
            <Title order={2}>{localizedRace}</Title>
          </Flex>

          <Text size="lg">{RaceBagDescription[raceToFetch]}</Text>
        </Stack>

        <Flex direction="row" align="center" gap={16} mt={24}>
          <IconBarrierBlock size={50} />
          <Text color="orange.6" italic>
            Important Note: This section displays all the units available in-game, including
            campaign-only.
          </Text>
        </Flex>

        <Stack mt={32}>
          <Title order={4}>Units</Title>

          <Grid columns={2}>
            {units.map(({ id, ui }) => {
              return (
                <Grid.Col key={id} span={1}>
                  <Anchor
                    color="undefined"
                    underline={false}
                    sx={{
                      "&:hover": {
                        textDecoration: "none",
                      },
                    }}
                    component={Link}
                    href={`/explorer/races/${raceToFetch}/units/${id}`}
                  >
                    <Card p="lg" radius="md" withBorder>
                      {UnitDescriptionCard({
                        screen_name: ui.screenName,
                        help_text: ui.helpText,
                        brief_text: ui.briefText,
                        symbol_icon_name: ui.symbolIconName,
                        icon_name: ui.iconName,
                      })}
                    </Card>
                  </Anchor>
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>
      </ContentContainer>
    </>
  );
};

export const getStaticProps = async () => {
  const { locstring, sbpsData } = await getMappings();

  return {
    props: {
      locstring,
      sbpsData,
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ unitId: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default ExplorerUnits;
