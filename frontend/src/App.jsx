import { useEffect, useState } from 'react'
import { SquarePen,Trash2 } from 'lucide-react';
import User from '../images/user.png'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndividualStudent from '../pages/IndividualsPage';
import Users from '../pages/UsersPage';

import './App.css'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />}></Route>
        <Route path="/student/:username" element={<IndividualStudent/>}></Route>

      </Routes>
    </BrowserRouter>
  )

}

export default App
