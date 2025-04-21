
import CategoryNews from "@/components/Index/CategoryNews";
import LastNews from "@/components/Index/LastNews";
import React from "react";

const HomePage = async () => {
  return (
    <div>
      <LastNews />
      <CategoryNews />
    </div>
  );
};

export default HomePage;
