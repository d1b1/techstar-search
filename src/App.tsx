import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import headerImage from './assets/logo.png';
import fallbackImage from './assets/no-logo.png';
import crunchbaseLogo from './assets/crunchbase.png';
import GitHubButton from 'react-github-btn';
import CustomModal from './Modal2';

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
  'UD1VE6KV0J',
  '1b3aa8792d6de4c1dde62071448d8a6d'
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <img src={headerImage} className="logo" />
        </h1>
        <p className="header-subtitle">
          Find Companies by 'Program', 'year', 'status' or 'stage'.
        </p>
        <div className="gh-btn">
          <GitHubButton href="https://github.com/d1b1/techstar-search" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star d1b1/techstar-search on GitHub">Star</GitHubButton>
        </div>
      </header>

      <div className="container">

        <CustomModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          content={<p>Modal Content</p>}
        />

        <InstantSearch
          searchClient={searchClient}
          indexName="Techstars"
          future={future}
        >
          <Configure hitsPerPage={10} />

          <div className="search-panel">
            <div className="filters" >

              <div className="filter-el">
                <h4>
                  Program City:
                </h4>
                <RefinementList searchable="true" attribute="accelerator" searchablePlaceholder="Enter program..." limit="5" />
              </div>

              <div className="filter-el">
                <h4>
                  Program Year:
                </h4>
                <RefinementList sortFacetValuesBy="alpha" attribute="sessionYear" />
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

              <Hits hitComponent={Hit} onOpenModal={handleOpenModal}/>

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

const YearsBetween = ({ year }) => {
  const currentYear = new Date().getFullYear();
  const yearsBetween = currentYear - year;

  return <span>{yearsBetween} years</span>;
};

function Hit({ hit }: HitProps, onOpenModal) {
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
          <br />
          <b>Type:</b> {hit['type']}, 
          <b>Stage:</b> {hit['stage']}<br/>
          <b>Age: </b> <YearsBetween year={hit.sessionYear} /><br />
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


        {/* <button onClick={onOpenModal}>
          Open Modal
        </button> */}

      </div>
    </article>
  );
}
