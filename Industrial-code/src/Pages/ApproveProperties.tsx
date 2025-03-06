import React, { useEffect, useState } from "react";
import style from '../styles/HomePage.module.css'
import { getAdminAllProperties, getProperties } from "../services/Api/Property";
import PropertyCard from "./PropertyCard";

export function ApproveProperties() {

  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAdminAllProperties('PENDING');
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
                <PropertyCard property_obj={item} showButtons={true} />
              </div>
            )
          })
        }
      </div>

    </>
  )
}

export default ApproveProperties;