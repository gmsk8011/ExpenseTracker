import { currencyFormatter } from "@/lib/utils"
import { useState } from "react"
import Viewexpensemodal from "./modals/Viewexpensemodal"

function Items({ expense, setex }) {
    const [showexmod, setshowexmod] = useState(false)
    return (
        <>
            <Viewexpensemodal open={showexmod} close={setshowexmod} expense={expense} setex={setex}>

            </Viewexpensemodal>
            <button onClick={() => setshowexmod(true)}>
                <div className="flex items-center justify-between px-4 py-4 bg-slate-600 rounded-3xl transition-all duration-100 hover:scale-110">
                    <div className="flex items-center gap-2">
                        <div className="w-[25px] h-[25px] rounded-full" style={{ backgroundColor: expense.color }}></div>
                        <h4>{expense.title}</h4>
                    </div>
                    <p>{currencyFormatter(expense.total)}</p>
                </div>
            </button>
        </>
    )
}

export default Items