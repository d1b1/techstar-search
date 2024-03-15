import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import headerImage from './assets/logo.png';
import fallbackImage from './assets/no-logo.png';
import crunchbaseLogo from './assets/crunchbase.png';

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

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const transformItems = (items) => {
  return items.map((item) => ({
    ...item,
    label: item.label.replace(/_/g, ' '),
  }));
};

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <img src={headerImage} className="logo" />
        </h1>
        <p className="header-subtitle">
          Find Companies by 'Program', 'year', 'status' or 'stage'.
        </p>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="techstars"
          future={future}
        >
          <Configure hitsPerPage={10} />
          <div className="search-panel">
            <div className="filters" >

              <div className="filter-el">
                <h4>
                  Accelerator:
                </h4>
                <RefinementList searchable="true" attribute="accelerator" showMore="false" showMoreLimit="30" searchablePlaceholder="Enter program..." limit="5" />
              </div>

              <div className="filter-el">
                <h4>
                  Current Status:
                </h4>
                <RefinementList attribute="status" />
              </div>

              <div className="filter-el">
                <h4>
                  HQ City:
                </h4>
                <RefinementList searchable="true" searchablePlaceholder="Enter a city..." attribute="city" />
              </div>

              <div className="filter-el">
                <h4>
                  HQ Country:
                </h4>
                <RefinementList attribute="country" />
              </div>

              <div className="filter-el">
                <h4>
                  Program Status:
                </h4>
                <RefinementList attribute="program_status" transformItems={transformItems} />
              </div>

            </div>
            <div className="search-panel__results">
              <SearchBox placeholder="Enter a techstars company..." className="searchbox" />

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

function ImageWithFallback({ src, alt, ...props }) {
  const handleError = (e) => {
    e.target.src = fallbackImage;
  };

  return <img src={src} alt={alt} onError={handleError} {...props} />;
}

function Hit({ hit }: HitProps) {
  return (
    <article>
      <a href={hit['website']} target="_blank">
        <ImageWithFallback src={hit.logo_url} width="80" alt={hit.name} />
      </a>
      <div className="element">
        <h1>
          <Highlight attribute="name" hit={hit} />
        </h1>
        <p>
          <Highlight attribute="description" hit={hit} />
        </p>
        <p>
          <b>HQ City:</b> <Highlight attribute="city" hit={hit} />,
          <b>Status:</b> <Highlight attribute="status" hit={hit} />,
          <b>Type:</b> {hit['type']},
          <b>Stage:</b> {hit['stage']}
        </p>
        <p>
          <b>Accelerator:</b>
          {hit['accelerator']} in {hit['session']}
        </p>
        <p>
          <Highlight attribute="country" hit={hit} />
        </p>
        <p>
          {hit['crunchbase_profile'] ?
            <a href={`https://${hit['crunchbase_profile']}`} target="_blank">
              <img src={crunchbaseLogo} className="crunch" />
            </a>
            : null}
        </p>
      </div>
      <div className="info">
        <table>
          {hit['founder_profile_arrays'].map((item, index) => (
            <tr key={index}>
              <td>
                <a href={`https://${item[3]}`} target="_blank">
                  <img src={item[2]} className="avatar" />
                </a>
              </td>
              <td>
                {item[0]}
                &nbsp;
                { item[1] && item[1] !== 'UNKNOWN' ? `(${item[1]})` : null }
              </td>
            </tr>
          ))}
        </table>
      </div>
    </article>
  );
}
