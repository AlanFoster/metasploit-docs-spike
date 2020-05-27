import React, { Component } from 'react';
import {
  InstantSearch,
  Configure,
  Index,
  Highlight,
  Snippet,
  connectAutoComplete,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import './search.css';
import { Input, AutoComplete, Typography } from 'antd';
import { navigate } from 'gatsby';
import { Rank } from '../rank';

const { Title, Text, Paragraph } = Typography;

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID || '',
  process.env.GATSBY_ALGOLIA_SEARCH_KEY || ''
);

const renderWikiItem = (hit) => {
  return (
    <React.Fragment>
      <Paragraph>
        <Text strong>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </Text>
      </Paragraph>
      <Paragraph>
        <Text>
          <Highlight attribute="content" hit={hit} tagName="mark" />
        </Text>
      </Paragraph>
    </React.Fragment>
  );
};

const renderModuleDetailItem = (hit) => {
  return (
    <React.Fragment>
      <Paragraph
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          whiteSpace: 'normal',
        }}
      >
        <Text strong>
          <Highlight attribute="name" hit={hit} tagName="mark" />
        </Text>
        <span>
          <Rank rank={hit.rank} />
        </span>
      </Paragraph>

      <Paragraph>
        <Text>
          <Highlight attribute="content" hit={hit} tagName="mark" />
        </Text>
      </Paragraph>
    </React.Fragment>
  );
};

const renderItem = (hit, index) => ({
  value: hit.slug,
  label: index === 'Wiki' ? renderWikiItem(hit) : renderModuleDetailItem(hit),
});

const SearchComponent = function ({ hits, currentRefinement, refine }: any) {
  const options = hits
    .filter((indexHit) => indexHit.hits.length > 0)
    .map((indexHit) => {
      return {
        label: indexHit.index,
        options: indexHit.hits.map((hit) => {
          return renderItem(hit, indexHit.index);
        }),
      };
    });

  const onSearch = (searchText: string) => {
    refine(searchText);
  };

  const onSelect = (slug: string) => {
    navigate(slug);
  };

  return (
    <AutoComplete
      dropdownClassName="search"
      dropdownMatchSelectWidth={500}
      listHeight={450}
      style={{
        width: 250,
      }}
      options={currentRefinement.length > 0 ? options : []}
      value={currentRefinement}
      onSelect={onSelect}
      onSearch={onSearch}
      notFoundContent={
          currentRefinement.length > 0 &&
          <Paragraph style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Text strong>
              No results found for query {JSON.stringify(currentRefinement)}
            </Text>
          </Paragraph>
      }
    >
      <Input.Search size="large" placeholder={currentRefinement} />
    </AutoComplete>
  );
};

const ConnectedAutocomplete = connectAutoComplete(SearchComponent);

export default function App() {
  return (
    <InstantSearch searchClient={searchClient} indexName="Wiki">
      <ConnectedAutocomplete />
      <Configure hitsPerPage={5} />
      <Index indexName="Wiki" />
      <Index indexName="Modules" />
    </InstantSearch>
  );
}
