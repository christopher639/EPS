import React from 'react'
import NavBar from './components/NavBar'
import { ToastContainer } from 'react-toastify'; // Import Toastify
import Performance from './components/Performance'
import SideBar from './components/SideBar'
import { Routes,Route } from 'react-router-dom'
import Select from './components/Select'
import Math from './Subjects/Math'
import EnterMarks from './components/EnterMarks'
import Eng from './Subjects/Eng'
import MathFormData from './Forms/MathFormData'

import EngFormData from './Forms/EngFormData'
import KiswaFormData from './Forms/KiswaFormData';
import Kiswa from './Subjects/Kiswa';
import Phys from './Subjects/Phys';
import PhycFormData from './Forms/PhycFormData';
import Bs from './Subjects/Bs';
import BsFormData from './Forms/BsFormData';
import Bio from './Subjects/Bio';
import BioFormData from './Forms/BioFormData';
import ChemFormData from './Forms/ChemFormData';
import Chem from './Subjects/Chem';
import AgriFormData from './Forms/AgriFormData';
import Agri from './Subjects/Agri';
import HistoFormData from './Forms/HistoFormData';
import Histo from './Subjects/Histo';
const App = () => {
  return (
    <div className=' min-h-full  fixed w-full'>
   
      <NavBar/>
       <div className='flex flex-row '>
      
        <div className='border-l hidden sm:flex  flex-col w-1/6 h-screen border-r border-slate-500 '>
            <SideBar/>
        </div>
        <div className='w-full'>
      
            <Routes>
                  <Route path="/select-subject" element ={<Select/>}/>
                  <Route path="/performance" element ={<Performance/>}/>
                  <Route path ="/math" element ={<Math/>}/>
                  <Route path ="/entermarks" element ={<EnterMarks/>}/>
                  <Route path ="/eng" element ={<Eng/>}/>
                  <Route path ="/kiswa" element ={<Kiswa/>}/>
                  <Route path ="/mathformdata" element ={<MathFormData/>}/>
                  <Route path ="/kiswaformdata" element ={<KiswaFormData/>}/>
                  <Route path ="/engformdata" element ={<EngFormData/>}/>
                  <Route path ="/physcformdata" element ={<PhycFormData/>}/>
                  <Route path ="/physc" element ={<Phys/>}/>
                  <Route path ="/bsformdata" element ={<BsFormData/>}/>
                  <Route path ="/bs" element ={<Bs/>}/>
                  <Route path ="/bioformdata" element ={<BioFormData/>}/>
                  <Route path ="/bio" element ={<Bio/>}/>

                  <Route path ="/chemformdata" element ={<ChemFormData/>}/>
                  <Route path ="/chem" element ={<Chem/>}/>
                  <Route path ="/agriformdata" element ={<AgriFormData/>}/>
                  <Route path ="/agri" element ={<Agri/>}/>
                  <Route path ="/histoformdata" element ={<HistoFormData/>}/>
                  <Route path ="/histo" element ={<Histo/>}/>
            </Routes>
        </div>
   </div>
    </div>
  )
}

export default App
