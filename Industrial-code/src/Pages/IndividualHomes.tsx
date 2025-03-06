import React, { useEffect, useState } from "react";
import style from '../styles/HomePage.module.css'
import { getProperties, getPropertyByType } from "../services/Api/Property";
import PropertyCard from "./PropertyCard";

export function IndividualHomes() {

  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getPropertyByType('INDIVIDUAL');
        if (response.success) {
          setData(response.data)

        }
      }
      catch (err) {
        console.log("Error occurred")
      }

    }
    getData();
  }, [])

  return (
    <>
      <div className={style.propertycontainer}>


        {
          data && data.map((item, index) => {
            return (
              <div key={index}>
                <PropertyCard property_obj={item} showButtons={false} />
              </div>
            )
          })
        }
      </div>

    </>
  )
}

export default IndividualHomes;