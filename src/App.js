import React, { useState } from "react";

import countriesData from "./data/countries";
import styles from "./App.module.css";
import Table from "./components/Table";

const App = () => {
  const [countries] = useState([...countriesData]);
  const columns = [
    {
     name: "name",
     label: "Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "company",
     label: "Company",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "city",
     label: "City",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "state",
     label: "State",
     options: {
      filter: true,
      sort: false,
     }
    },
   ];
   
   const data = [
    { name: "Aoe James", company: "Hst Corp", city: "Yonkers", state: "NY" },
    { name: "Bohn Walsh", company: "5est Corp", city: "Hartford", state: "CT" },
    { name: "Cob Herm", company: "xest Corp", city: "Tampa", state: "FL" },
    { name: "Dames Houston", company: "Eest Corp", city: "Dallas", state: "TX" },
   ];

const options = {
  filterType: 'checkbox',
};
  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <Table data={data} rowsPerPage={4} title={"Employee List"} columns={columns}/>
      </div>
    </main>
  );
};

export default App;
