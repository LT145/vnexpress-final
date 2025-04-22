
import CategoryNews from "@/components/Index/CategoryNews";
import LastNews from "@/components/Index/LastNews";
import AdvertisementHomeTop from "@/components/Advertisement/AdvertisementHomeTop";
import AdvertisementHomeBottom from "@/components/Advertisement/AdvertisementHomeBottom";
import React from "react";

const HomePage = async () => {
  return (
    <div>
      <AdvertisementHomeTop />
      <LastNews />
      <CategoryNews />
      <AdvertisementHomeBottom />
    </div>
  );
};

export default HomePage;
