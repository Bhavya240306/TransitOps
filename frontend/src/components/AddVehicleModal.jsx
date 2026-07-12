import { useState } from "react";
import api from "../api/axios";

export default function AddVehicleModal({

close,

refresh

}){

const[data,setData]=useState({

registrationNumber: "",
make: "",
model: "",
capacityKg: ""

});

async function submit(e){

e.preventDefault();

await api.post("/vehicles",data);

refresh();

close();

}

return(

<div className="fixed inset-0 bg-black/50 flex justify-center items-center">

<div className="bg-white dark:bg-slate-900 rounded-xl p-8 w-96">

<h2 className="text-2xl font-bold mb-5">

Add Vehicle

</h2>

<form
onSubmit={submit}
className="space-y-4"
>

<input

placeholder="Registration"

className="w-full border p-3 rounded"

onChange={(e)=>

setData({

...data,

registrationNumber:e.target.value

})

}

/>

<input

placeholder="Model"

className="w-full border p-3 rounded"

onChange={(e)=>

setData({

...data,

model:e.target.value

})

}

/>

<input

placeholder="Capacity"

type="number"

className="w-full border p-3 rounded"

onChange={(e) =>
  setData({
    ...data,
    capacityKg: e.target.value
  })
}

/>

<div className="flex justify-end gap-3">

<button
type="button"
onClick={close}
>

Cancel

</button>

<button
className="bg-blue-600 text-white px-5 py-2 rounded"
>

Save

</button>

</div>

</form>

</div>

</div>

)

}