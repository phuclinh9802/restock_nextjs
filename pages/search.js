import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import styles from "../styles/Home.module.css";
import Layout from "../components/layout";
import { makeStyles } from "@mui/styles";

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

  let defaultData;

  data.map((el) => {
    if (el.Symbol == "AAPL") {
      defaultData = el;
    }
  });

  // console.log(defaultData);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [info, setInfo] = useState("");
  const [ticker, setTicker] = useState("");
  const [appl, setAppl] = useState("");
  const [meta, setMeta] = useState("");
  const [tsla, setTsla] = useState("");
  const loading = open && options.length === 0;

  // const fetchData = () => {
  //   fetch(
  //     `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=${process.env.POLY_API_KEY}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setAppl(data));

  //   fetch(
  //     `https://api.polygon.io/v2/aggs/ticker/META/prev?adjusted=true&apiKey=${process.env.POLY_API_KEY}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setMeta(data));
  //   fetch(
  //     `https://api.polygon.io/v2/aggs/ticker/TSLA/prev?adjusted=true&apiKey=${process.env.POLY_API_KEY}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setTsla(data));
  // };

  // useEffect(() => {
  //   if (!appl && !meta && !tsla) {
  //     fetchData();
  //   }
  // }, [appl.ticker, meta.ticker, tsla.ticker]);

  // console.log(appl);
  // console.log(meta);
  // console.log(tsla);

  const getData = (event, value) => {
    setTicker(value);
    console.log(value);
  };

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
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (ticker) {
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker.Symbol}/prev?adjusted=true&apiKey=${process.env.POLY_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => setInfo(data));
    }
  }, [ticker]);

  return (
    <Layout>
      <div className={styles.stocksection}>
        <div className={styles.activestock}>
          <div className={styles.ticker} id="stock1">
            <h2 className={styles.stockname}>AAPL</h2>
            {appl && !appl.error ? (
              <h1 className={styles.stockprice}>${appl.results[0].c}</h1>
            ) : (
              <h2>Loading...</h2>
            )}
            <div className={styles.change}>
              {/* <p className={styles.pricechange}>-6.15</p>
              <p className={styles.percentagechange}>(-4.24%)</p> */}
            </div>
          </div>
          <div className={styles.ticker} id="stock2">
            <h2 className={styles.stockname}>META</h2>
            {meta && !meta.error ? (
              <h1 className={styles.stockprice}>${meta.results[0].c}</h1>
            ) : (
              <h2>Loading...</h2>
            )}
            <div className={styles.change}>
              {/* <p className={styles.pricechange}>-1.63</p>
              <p className={styles.percentagechange}>(-1.80%)</p> */}
            </div>
          </div>
          <div className={styles.ticker} id="stock3">
            <h2 className={styles.stockname}>TSLA</h2>
            {tsla && !tsla.error ? (
              <h1 className={styles.stockprice}>${tsla.results[0].c}</h1>
            ) : (
              <h2>Loading...</h2>
            )}
            <div className={styles.change}>
              {/* <p className={styles.pricechange}>0.33</p>
              <p className={styles.percentagechange}>(0.15%)</p> */}
            </div>
          </div>
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
          getOptionLabel={(data) => data.Symbol}
          options={options}
          sx={{ width: 500, borderColor: "#fff" }}
          renderOption={(props, data) => (
            <Box component="li" {...props} key={data.Symbol}>
              {data.Name} - {data.Symbol}
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
        {info.results ? (
          <div className={styles.stockdetails}>
            <div className={styles.pricesection}>
              <h2>
                {info.ticker}{" "}
                {/* <span className={styles.symbol}>({info.ticker})</span> */}
              </h2>
              <p>${info.results[0].c}</p>
              {/* <p> (5.3%)</p> */}
            </div>
            <div className={styles.details}>
              <h3 className={styles.summary}>Summary</h3>
              <div className={styles.content}>
                <p>High: {info.results[0].h}</p>
                <p>Low: {info.results[0].l}</p>
                <p>Open: {info.results[0].o}</p>

                <p>Volume: {info.results[0].v}</p>
                <p>Volume weighted AVG Price: {info.results[0].vw}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.stockdetails}>
            <div className={styles.pricesection}>
              <p>Loading, please wait...</p>
              {/* <p> (5.3%)</p> */}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://pkgstore.datahub.io/core/s-and-p-500-companies-financials/constituents-financials_json/data/${process.env.DATAHUB_KEY}/constituents-financials_json.json`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}
