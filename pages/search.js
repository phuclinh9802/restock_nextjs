import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import styles from "../styles/Home.module.css";
import Layout from "../components/layout";
import { makeStyles } from "@mui/styles";
import Image from "next/image";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    backgroundColor: "#eee",
    "& .MuiOutlinedInput-notchedOutline": {
      borderWidth: "2px",
      borderColor: "#ddd",
    },
    "& MuiFormLabel.MuiInputLabel": {
      display: "none",
    },
  },
}));

export default function Search({ data }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [info, setInfo] = useState("");
  const [moreInfo, setMoreInfo] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ticker, setTicker] = useState("");
  const [toggle, setToggle] = useState(false);
  const [toggleSummary, setToggleSummary] = useState(true);
  const [core, setCore] = useState(null);
  const [dividend, setDividend] = useState(null);

  const loading = open && options.length === 0;

  useEffect(() => {
    if (!core) {
      fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${process.env.NEXT_PUBLIC_ACTIVE_KEY}`
      )
        .then((res) => res.json())
        .then((data) => setCore(data));
    }
  }, [core]);

  const handleWinning = () => {
    setToggle(true);
  };
  const handleLosing = () => {
    setToggle(false);
  };

  const handleSummary = () => {
    setToggleSummary(true);
  };
  const handleProfile = () => {
    setToggleSummary(false);
  };

  const getData = (event, value) => {
    setTicker(value);
  };

  useEffect(() => {
    let newInfo = {};
    for (let i = 0; i < data.length; i++) {
      if (ticker && data[i].symbol == ticker.symbol) {
        newInfo = data[i];
        setMoreInfo(data[i]);
        break;
      }
    }
  }, [ticker, moreInfo, data]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3);

      if (active) {
        setOptions([...data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (ticker) {
      fetch(
        `https://financialmodelingprep.com/api/v3/profile/${ticker.symbol}?apikey=${process.env.NEXT_PUBLIC_ACTIVE_KEY_BACKUP}`
      )
        .then((res) => res.json())
        .then((data) => setProfile(data));
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker) {
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker.symbol}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLY_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => setInfo(data));
    }
  }, [ticker]);

  let activeWinningStocks;
  let activeLosingStocks;
  if (core) {
    core.sort((a, b) => b.changesPercentage - a.changesPercentage);
    let tempCore = core;

    let activeWinners = tempCore.slice(0, 6);
    console.log(activeWinners);
    let activeLosers = tempCore.slice(tempCore.length - 6, tempCore.length);

    let newActiveWinningStocks = activeWinners.slice(0, 5);
    activeWinningStocks = activeWinners.map((data, i) => (
      <div key={i} className={styles.ticker}>
        <h2 className={styles.stockname}>{data["symbol"]}</h2>
        <h1 className={styles.stockprice}>${data["price"].toFixed(2)}</h1>
        <div className={styles.change}>
          <p className={styles.pricechange}>{data["change"].toFixed(2)}</p>
          <p className={styles.percentagechange}>
            ({data["changesPercentage"].toFixed(2)}%)
          </p>
        </div>
      </div>
    ));

    activeLosingStocks = activeLosers.map((data, i) => (
      <div key={i + 3} className={styles.ticker}>
        <h2 className={styles.stockname}>{data["symbol"]}</h2>
        <h1 className={styles.stockprice}>${data["price"].toFixed(2)}</h1>
        <div className={styles.change}>
          <p className={styles.pricechange}>{data["change"].toFixed(2)}</p>
          <p className={styles.percentagechange}>
            ({data["changesPercentage"].toFixed(2)}%)
          </p>
        </div>
      </div>
    ));
  }

  console.log(profile);
  return (
    <Layout>
      <div className={styles.stocksection}>
        <ul className={styles.activetabs}>
          <li>
            <button onClick={handleWinning}>Top Active Winning Stocks</button>
          </li>
          <li>
            <button onClick={handleLosing}>Top Active Losing Stocks</button>
          </li>
        </ul>
        <div className={styles.activestock}>
          {toggle ? activeWinningStocks : activeLosingStocks}
        </div>

        <Autocomplete
          classes={classes}
          disablePortal
          id="combo-box-demo"
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={getData}
          loading={loading}
          getOptionLabel={(data) => data.symbol}
          groupBy={(option) => option.sector}
          options={options.sort((a, b) => b.sector.localeCompare(a.sector))}
          sx={{ width: "50vw", borderColor: "#fff" }}
          renderOption={(props, data) => (
            <Box component="li" {...props} key={data.symbol}>
              {data.companyName} - {data.symbol}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              style={{ color: "white" }}
              {...params}
              label="Search your stock..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        {info.status == "ERROR" ? (
          <p>
            It is either loading, or you have exceeded 5 searches per minute due
            to the limited API calls. Please wait...
          </p>
        ) : (
          <>
            {info.results ? (
              <>
                <div className={styles.stockdetails}>
                  <>
                    <div className={styles.pricesection}>
                      <h2>
                        {moreInfo.companyName} ({info.ticker}){" "}
                        {/* <span className={styles.symbol}>({info.ticker})</span> */}
                      </h2>
                      <p>${moreInfo.price}</p>
                      {profile ? (
                        <p>
                          {" "}
                          (
                          {profile[0].changes.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          )
                        </p>
                      ) : null}
                    </div>
                    <div className={styles.details}>
                      <div className={styles.headersummary}>
                        <h3 className={styles.summary}>Summary</h3>
                        <ul className={styles.profiletabs}>
                          <li>
                            <button onClick={handleSummary}>Summary</button>
                          </li>
                          <li>
                            <button onClick={handleProfile}>Profile</button>
                          </li>
                        </ul>
                        {profile ? (
                          <div>
                            <img
                              className={styles.img}
                              src={profile[0].image}
                              alt={profile[0].companyName}
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.content}>
                        {toggleSummary ? (
                          <>
                            <p>High: {info.results[0].h}</p>
                            <p>Low: {info.results[0].l}</p>
                            <p>Open: {info.results[0].o}</p>

                            <p>
                              Volume:{" "}
                              {info.results[0].v.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p>
                              Volume weighted AVG Price: {info.results[0].vw}
                            </p>
                            <p>
                              Market Cap:{" "}
                              {moreInfo.marketCap.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Company Name: {profile[0].companyName}</p>
                            <p>CEO: {profile[0].ceo}</p>
                            <p>
                              Headquarters: {profile[0].address}
                              {", "}
                              {profile[0].city},{" "}
                              {profile[0].state.charAt(0).toUpperCase() +
                                profile[0].state.slice(1).toLowerCase()}{" "}
                              {profile[0].zip}
                            </p>
                            <p></p>
                            <p>Sector: {profile[0].sector}</p>
                            <p></p>
                            <p className={styles.companydescription}>
                              Company Description: {profile[0].description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://financialmodelingprep.com/api/v3/stock-screener?limit=5000&apikey=${process.env.NEXT_PUBLIC_ACTIVE_KEY}`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}
