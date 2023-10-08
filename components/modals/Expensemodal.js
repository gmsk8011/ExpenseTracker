import Modals from "@/components/Modals"
import { useRef, useState } from "react"
import { FaRegTrashAlt } from "react-icons/fa"
import { currencyFormatter } from "@/lib/utils"
import { db } from "@/lib/firebase/config"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

function Expensemodal({ open, close, expense, setex }) {
    const [examount, setexamount] = useState("")
    const [catagory, setcatagory] = useState(null)
    const [showadd, setshowadd] = useState(false)

    const titleRef = useRef()
    const colorRef = useRef()

    const addexpenseitem = async (expensecatagortid, newexpense) => {
        const collectionRef = doc(db, "expenses", expensecatagortid)
        try {
            await updateDoc(collectionRef, { ...newexpense })
            setex(prevstate => {
                const updateexpense = [...prevstate]
                const foundindex = updateexpense.findIndex(ex => {
                    return ex.id === expensecatagortid
                })
                updateexpense[foundindex] = { id: expensecatagortid, ...newexpense }
                return updateexpense
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    const addexpense = async () => {
        const expenses = expense.find(e => {
            return e.id === catagory
        })

        const newexpense = {
            color: expenses.color,
            title: expenses.title,
            total: expenses.total + +examount,
            items: [
                ...expenses.items,
                {
                    amount: +examount,
                    createdAt: new Date(),
                    id: uuidv4()
                }
            ]
        }
        try {
            await addexpenseitem(catagory, newexpense)
            setexamount("")
            setcatagory(null)
            close()
        } catch (error) {
            console.log(error.message);
        }
    }

    const addcategory = async () => {
        const title = titleRef.current.value
        const color = colorRef.current.value
        try {
            await addcat({title, color, total: 0})
            setshowadd(false)
        } catch (error) {
            console.log(error.message);
        }
    }

    const addcat = async (category) => {
        try {
            const collectionRef = collection(db, "expenses")
            const docsnap = await addDoc(collectionRef, { 
                ...category,
                items: [],
             })
             setex(prevstate => {
                return [
                    ...prevstate,
                    {
                        id: docsnap.id,
                        items: [],
                        ...category
                    }
                ]
             })
            
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Modals open={open} close={close}>
            <div className="flex flex-col gap-4">
                <label>Enter amount</label>
                <input type="number" min={0.01} step={0.01} className="px-4 py-2 rounded-xl bg-slate-600" placeholder="Enter amount" value={examount} onChange={(e) => {
                    setexamount(e.target.value)
                }} />
            </div>
            {
                examount > 0 &&
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center justify-between">
                        <h3>Select expense category</h3>
                        <button className="text-lime-400" onClick={() => setshowadd(true)}>+ New Category</button>
                    </div>
                    {showadd && <div className="flex items-center justify-between">
                        <input type="text" placeholder="Enter title" ref={titleRef} className="px-4 py-2 rounded-xl bg-slate-600" />
                        <label>Pick color</label>
                        <input type="color" ref={colorRef} className="px-1 py-1 rounded-xl bg-slate-600" />
                        <button className="text-emerald-500 rounded-md border border-lime-200 p-1 transition-all duration-100 hover:scale-110" onClick={addcategory}>Create</button>
                        <button className="bg-red-600 p-1 rounded-md transition-all duration-100 hover:scale-110" onClick={() => setshowadd(false)}>Cancel</button>
                    </div>}
                    {expense.map(ex => {
                        return (
                            <button key={ex.id} onClick={() => setcatagory(ex.id)} className="transition-all duration-100 hover:scale-110">
                                <div style={{
                                    boxShadow: ex.id === catagory ? "1px 1px 4px" : "none"
                                }} className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[25px] h-[25px] rounded-full" style={{
                                            backgroundColor: ex.color
                                        }}>
                                        </div>
                                        <h4>{ex.title}</h4>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            }
            {
                examount > 0 && catagory && (
                    <div className="mt-6">
                        <button onClick={addexpense} className="bg-lime-700 rounded-lg p-2">Add Expense</button>
                    </div>
                )
            }
        </Modals>
    )
}

export default Expensemodal