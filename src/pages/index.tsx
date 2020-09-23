import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useBobasQuery } from "../generated/graphql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import {  Button, Flex, Heading, Link, Stack, Box } from "@chakra-ui/core";
import { BobaIndex } from "../components/BobaIndex";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 25,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = useBobasQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>Query failed</div>;
  }

  return (
    <Layout>
      <Flex>
        <Heading>Boba Tracker</Heading>{" "}
        <NextLink href="add-boba">
          <Link ml="auto">Add Boba</Link>
        </NextLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.bobas.bobas.map((boba) => (
            <Box key={boba._id}>
              <BobaIndex boba={boba} />
            </Box>  
          ))}
        </Stack>
      )}
      {data && data.bobas.hasMore ? (
        <Flex>
          <Button
            my={8}
            isLoading={fetching}
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.bobas.bobas[data.bobas.bobas.length - 1].createdAt,
              })
            }
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
