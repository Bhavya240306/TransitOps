import { useEffect, useState } from "react";
import api from "../api/axios";

import VehicleTable from "../components/VehicleTable";
import AddVehicleModal from "../components/AddVehicleModal";

export default function Vehicles() {

    const [vehicles,setVehicles]=useState([]);
    const [search,setSearch]=useState("");
    const [showModal,setShowModal]=useState(false);

    async function loadVehicles(){

        try{

            const res=await api.get("/vehicles");

            setVehicles(res.data);

        }catch(err){

            console.log(err);

        }

    }

    useEffect(()=>{

        loadVehicles();

    },[]);

    const filtered=vehicles.filter(vehicle=>

        vehicle.registrationNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );

    return(

        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Vehicle Registry
                </h1>

                <button
                    onClick={()=>setShowModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    + Add Vehicle
                </button>

            </div>

            <input

                placeholder="Search Vehicle..."

                className="border rounded-lg px-4 py-2 w-80 mb-6 dark:bg-slate-800"

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />

            <VehicleTable

                vehicles={filtered}

                refresh={loadVehicles}

            />

            {showModal &&

                <AddVehicleModal

                    close={()=>setShowModal(false)}

                    refresh={loadVehicles}

                />

            }

        </div>

    )

}