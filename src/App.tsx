import { Global, css } from '@emotion/react';
import { useState, useEffect } from 'react';
import BarChart from './components/BarChart';
import CountryList from './components/CountryList';
import GlobalInfo from './components/GlobalInfo';
import type { ResponseData, Country } from './types';

const App: React.FunctionComponent = () => {
  const [data, setData] = useState<ResponseData | undefined>(undefined);
  const [activeCountries, setActiveCountries] = useState<Country[]>([]);

  const fetchData = async () => {
    const result = await fetch('https://api.covid19api.com/summary');
    const data: ResponseData = await result.json();

    setData(data);
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onCountryClick = (country: Country) => {
    const countryIndex = activeCountries.findIndex(
      (activeCountry) => activeCountry.ID === country.ID
    );

    if (countryIndex > -1) {
      // 이미 선택한 나라이기 때문에 인덱스 반환
      const newActiveCountries = [...activeCountries];
      newActiveCountries.splice(countryIndex, 1); // 선택한 나라 삭제

      setActiveCountries(newActiveCountries);
    } else {
      // 선택했던 나라가 아니면 -1 반환 >> 선택한 나라로 추가
      setActiveCountries([...activeCountries, country]); // 기존에 선택했던 나라 + 새로 선택한 나라
    }
  };

  return (
    <div>
      <Global
        styles={css`
          body {
            background-color: #f1f1f1;
            color: #7d7d7d;
          }
        `}
      />

      {data ? (
        <>
          <GlobalInfo
            newConfirmed={data?.Global.NewConfirmed}
            newDeaths={data?.Global.NewDeaths}
            newRecovered={data?.Global.NewRecovered}
          />
          <hr />

          {activeCountries.length ? (
            <BarChart countries={activeCountries} />
          ) : null}

          <CountryList
            countries={data.Countries}
            onItemClick={onCountryClick}
          />
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default App;
