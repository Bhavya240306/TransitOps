export default function ExportButton(){

function exportCSV(){

alert("CSV Export");

}

return(

<button

onClick={exportCSV}

className="bg-green-600 text-white px-5 py-3 rounded-lg"

>

Export CSV

</button>

)

}