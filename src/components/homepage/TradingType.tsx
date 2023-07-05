// import React from "react";
import AliceCarousel from "react-alice-carousel";
import "../../styles/main.scss";
import { TradeType } from "./TradeTypeArray";
import { Box } from "@mui/material";

const TradingType = () => {
  const responsive = {
    0: {
      items: 1,
    },
    // 1024: {
    //   items: 3,
    // },
  };

  const items = TradeType.map((tradeType, index) => (
    <div className="trade-card" key={index}>
      {/* <img src={tradeType.image} alt={tradeType.title} /> */}
      <div className="card-content">
        <h3>{tradeType.title}</h3>
        <p>{tradeType.Description}</p>
      </div>
    </div>
  ));

  return (
    <Box>
    <Box className="live-data-title">Types of Trading Markets</Box>
      <Box className="trade-carousel">
        <AliceCarousel
          mouseTracking
          infinite
          autoPlay
          autoPlayInterval={1800}
          animationDuration={1500}
          disableButtonsControls
          responsive={responsive}
          items={items}
        />
      </Box>
    </Box>
  );
};

export default TradingType;