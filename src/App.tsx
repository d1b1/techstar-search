import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  RefinementList
} from 'react-instantsearch';

import { Panel } from './Panel';

import type { Hit } from 'instantsearch.js';

import './App.css';

const searchClient = algoliasearch(
  'XQL63TD3C7',
  '66c53445092004ffa41e392ae2e2bab1'
);

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">Techstars Global Search</a>
        </h1>
        <p className="header-subtitle">
          Find by cohort, year, market and stage.
        </p>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="techstars"
          future={future}
        >
          <Configure hitsPerPage={8} />
          <div className="search-panel">
            <div className="search-panel__filters">
              <h4>
                  Current Status:
              </h4>
              <RefinementList attribute="status" />

              <h4>
                  City:
              </h4>
              <RefinementList attribute="city" />
            </div>



            <div className="search-panel__results">
              <SearchBox placeholder="Enter a name..." className="searchbox" />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

type HitProps = {
  hit: Hit;
};

function Hit({ hit }: HitProps) {
  return (
    <article>
      <img src={hit.logo_url} alt={hit.name} />
      <div>
        <h1>
          <Highlight attribute="name" hit={hit} />
        </h1>
        <p>
          <Highlight attribute="city" hit={hit} />
        </p>
        <p>
          <Highlight attribute="status" hit={hit} />
        </p>
      </div>
    </article>
  );
}
