import Modals from "@/components/Modals"
import { useRef, useState, useEffect } from "react"
import { FaRegTrashAlt } from "react-icons/fa"
import { currencyFormatter } from "@/lib/utils"
import { db } from "@/lib/firebase/config"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"

function Viewexpensemodal({ open, close, expense, setex }) {

    // const deleteexitem = async (item) => {
    //     try {
    //         const updateitems = expense.items.filter(i => i.id !== item.id)
    //         const updateexpense = {
    //             items: [...updateitems],
    //             total: expense.total - item.amount
    //         }
    //         const docRef = doc(db, "expenses", item.id)
    //         await updateDoc(docRef, { ...updateexpense })
    //         setex(prevstate => {
    //             const update = [...prevstate]
    //             const pos = update.findIndex(ex => ex.id === item.id)
    //             update[pos].items = [...updateexpense.items]
    //             update[pos].total = updateexpense.total
    //             return update
    //         })
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    const deleteexcat = async () => {
        try {
            const docRef = doc(db, "expenses", expense.id)
            await deleteDoc(docRef)
            setex(prevstate => {
                const update = prevstate.filter(ex => ex.id !== expense.id)
                return [...update]
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Modals open={open} close={close}>
            <div className="flex items-center justify-between">
                <h2 className="text-4xl">{expense.title}</h2>
                <button className="bg-red-600 p-1 rounded-md transition-all duration-100 hover:scale-110" onClick={deleteexcat}>Delete</button>
            </div>
            <div>
                <h3 className="my-4 text-2xl">Expense history</h3>
                {expense.items.map(item => {
                    return (
                        <div key={item.id} className="flex items-center justify-between">
                            <small>
                                {item.createdAt.toMillis ? new Date(item.createdAt.toMillis()).toISOString() : item.createdAt.toISOString()}
                            </small>
                            <p className="flex items-center gap-2">{currencyFormatter(item.amount)}</p>
                            {/* <button onClick={() => deleteexitem(item)}>
                                <FaRegTrashAlt></FaRegTrashAlt>
                            </button> */}
                        </div>
                    )
                })}
            </div>
        </Modals>
    )
}

export default Viewexpensemodal